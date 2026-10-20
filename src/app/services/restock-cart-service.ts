import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { MockBackendService } from '../utils';

export interface RestockCartItem {
  productId: string;
  name: string;
  quantity: number;
  // Richieste di riordino della sede confluite in questa riga (per ripristinarle se la riga viene tolta)
  requestIds: string[];
}

// Riepilogo dell'ultima richiesta inviata (mostrato nella pagina di conferma)
export interface SentRestockSummary {
  siteName: string;
  productCount: number;
}

const CART_STORAGE_KEY = 'cri_restock_cart_v2';

/**
 * Carrello della rifornitura sedi, condiviso tra le pagine
 * "Rifornitura sede" (aggiunta prodotti), "Ordine di rifornimento" (riepilogo)
 * e "Richiesta inviata". È separato da CartStateService, che gestisce il carrello dei beneficiari.
 *
 * Il carrello è salvato nel localStorage e lo stato delle richieste aggiunte ('Nel carrello')
 * è salvato nel MockBackendService: così restano coerenti anche cambiando pagina o ricaricando.
 */
@Injectable({ providedIn: 'root' })
export class RestockCartService {
  private readonly backend = inject(MockBackendService);

  private readonly saved = this.loadSaved();
  private readonly _items = signal<RestockCartItem[]>(this.saved.items);
  private readonly _siteId = signal<string>(this.saved.siteId);
  private readonly _lastSent = signal<SentRestockSummary | null>(null);

  readonly items = this._items.asReadonly();
  // Sede di destinazione dell'ordine in preparazione
  readonly siteId = this._siteId.asReadonly();
  readonly lastSent = this._lastSent.asReadonly();

  // Numero totale di pezzi nel carrello (mostrato nel badge del carrello)
  readonly totalQuantity = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));

  // Id delle richieste di riordino presenti nel carrello
  readonly requestIds = computed(() => this._items().flatMap(i => i.requestIds));

  constructor() {
    // Salva il carrello a ogni modifica
    effect(() => this.save({ siteId: this._siteId(), items: this._items() }));
  }

  /**
   * Aggiunge un prodotto. Se è già nel carrello somma la quantità (niente righe duplicate).
   * Se arriva da una richiesta della sede (requestId), la richiesta passa a 'Nel carrello'
   * e non compare più nell'elenco delle richieste.
   * Il carrello è relativo a una sola sede: se si aggiunge per un'altra sede, riparte da zero.
   */
  addItem(siteId: string, productId: string, name: string, quantity: number, requestId?: string): void {
    if (quantity <= 0) return;

    if (this._siteId() !== siteId) {
      // Le richieste del vecchio carrello tornano disponibili
      this.backend.setRestockRequestsStatus(this.requestIds(), 'In attesa');
      this._items.set([]);
      this._siteId.set(siteId);
    }

    const requestIds = requestId ? [requestId] : [];

    this._items.update(items => {
      const index = items.findIndex(i => i.productId === productId);
      if (index === -1) return [...items, { productId, name, quantity, requestIds }];

      const updated = [...items];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + quantity,
        requestIds: [...updated[index].requestIds, ...requestIds]
      };
      return updated;
    });

    if (requestId) {
      this.backend.setRestockRequestsStatus([requestId], 'Nel carrello');
    }
  }

  // Imposta la quantità di una riga; con quantità 0 o meno la riga viene rimossa
  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this._items.update(items => items.map(i => i.productId === productId ? { ...i, quantity } : i));
  }

  // Toglie una riga dal carrello: le sue richieste tornano nell'elenco della sede
  removeItem(productId: string): void {
    const removed = this._items().find(i => i.productId === productId);
    if (removed) {
      this.backend.setRestockRequestsStatus(removed.requestIds, 'In attesa');
    }
    this._items.update(items => items.filter(i => i.productId !== productId));
  }

  /**
   * Svuota il carrello SENZA ripristinare le richieste.
   * Si usa dopo l'invio dell'ordine: le richieste sono già passate a 'Inviata'.
   */
  clear(): void {
    this._items.set([]);
  }

  // Salva il riepilogo da mostrare nella pagina di conferma
  markSent(summary: SentRestockSummary): void {
    this._lastSent.set(summary);
  }

  private loadSaved(): { siteId: string; items: RestockCartItem[] } {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        return { siteId: saved.siteId ?? '', items: saved.items ?? [] };
      }
    } catch { /* storage non disponibile: carrello vuoto */ }
    return { siteId: '', items: [] };
  }

  private save(value: { siteId: string; items: RestockCartItem[] }): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value));
    } catch { /* nessun salvataggio: il carrello resta solo in memoria */ }
  }
}
