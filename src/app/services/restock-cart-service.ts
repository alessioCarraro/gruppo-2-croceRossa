import { Injectable, computed, signal } from '@angular/core';

export interface RestockCartItem {
  productId: string;
  name: string;
  quantity: number;
}

// Riepilogo dell'ultima richiesta inviata (mostrato nella pagina di conferma)
export interface SentRestockSummary {
  siteName: string;
  productCount: number;
}

/**
 * Carrello della rifornitura sedi, condiviso tra le pagine
 * "Rifornitura sede" (aggiunta prodotti), "Ordine di rifornimento" (riepilogo)
 * e "Richiesta inviata". È separato da CartStateService, che gestisce il carrello dei beneficiari.
 */
@Injectable({ providedIn: 'root' })
export class RestockCartService {
  private readonly _items = signal<RestockCartItem[]>([]);
  private readonly _siteId = signal<string>('');
  private readonly _lastSent = signal<SentRestockSummary | null>(null);

  readonly items = this._items.asReadonly();
  // Sede di destinazione dell'ordine in preparazione
  readonly siteId = this._siteId.asReadonly();
  readonly lastSent = this._lastSent.asReadonly();

  // Numero totale di pezzi nel carrello (mostrato nel badge del carrello)
  readonly totalQuantity = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));

  /**
   * Aggiunge un prodotto. Se è già nel carrello somma la quantità (niente righe duplicate).
   * Il carrello è relativo a una sola sede: se si aggiunge per un'altra sede, riparte da zero.
   */
  addItem(siteId: string, productId: string, name: string, quantity: number): void {
    if (quantity <= 0) return;

    if (this._siteId() !== siteId) {
      this._items.set([]);
      this._siteId.set(siteId);
    }

    this._items.update(items => {
      const index = items.findIndex(i => i.productId === productId);
      if (index === -1) return [...items, { productId, name, quantity }];

      const updated = [...items];
      updated[index] = { ...updated[index], quantity: updated[index].quantity + quantity };
      return updated;
    });
  }

  // Imposta la quantità di una riga; con quantità 0 o meno la riga viene rimossa
  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this._items.update(items => items.map(i => i.productId === productId ? { ...i, quantity } : i));
  }

  removeItem(productId: string): void {
    this._items.update(items => items.filter(i => i.productId !== productId));
  }

  clear(): void {
    this._items.set([]);
  }

  // Salva il riepilogo da mostrare nella pagina di conferma
  markSent(summary: SentRestockSummary): void {
    this._lastSent.set(summary);
  }
}
