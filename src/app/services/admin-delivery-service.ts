import { Injectable, computed, inject, signal } from '@angular/core';
import { MockBackendService } from '../utils';

// Prodotto della lista beni: giacenza della sede dell'Admin, dati dal catalogo condiviso
export interface DeliveryProduct {
  id: string;            // id del prodotto nel catalogo
  name: string;
  icon: 'bag' | 'bottle' | 'meat';
  category: string;
  stock: number;         // giacenza totale in sede
  expiry: string;        // scadenza più vicina (GG/MM/AAAA)
  expiryWarning: boolean;
  price: number;         // costo in token
  outOfStock: boolean;
}

// Prodotto selezionato per la consegna
export interface DeliverySelectionItem {
  id: string;
  name: string;
  unitTokenCost: number;
  quantity: number;
}

// Dati dell'ultima consegna confermata (per la pagina di successo)
export interface ConfirmedDelivery {
  beneficiaryName: string;
  items: { name: string; quantity: number }[];
  totalUnits: number;
  tokensUsed: number;
  remainingTokens: number;
  maxTokens: number;
}

/**
 * Selezione della consegna dell'Admin, condivisa tra "Lista beni", "Riepilogo" e "Consegna registrata".
 * Prodotti, giacenze e saldo token arrivano dal MockBackendService: qui c'è solo la selezione.
 * Durante la selezione i token NON vengono scalati: il saldo residuo è una previsione,
 * l'addebito vero avviene solo con confirm().
 */
@Injectable({ providedIn: 'root' })
export class AdminDeliveryService {
  private readonly backend = inject(MockBackendService);

  private readonly _beneficiaryId = signal<string | null>(null);
  private readonly _quantities = signal<Record<string, number>>({});
  private readonly _lastConfirmed = signal<ConfirmedDelivery | null>(null);

  readonly lastConfirmed = this._lastConfirmed.asReadonly();

  // Beneficiario della consegna (dati condivisi)
  readonly beneficiary = computed(() =>
    this.backend.beneficiaries().find(b => b.id === this._beneficiaryId()) ?? null
  );

  // Saldo token effettivo e massimo del beneficiario
  readonly balance = computed(() => this.beneficiary()?.tokens ?? 0);
  readonly maxTokens = computed(() => {
    const b = this.beneficiary();
    return b ? this.backend.getMaxTokens(b) : 0;
  });

  /** Prodotti disponibili nella sede dell'Admin (giacenze effettive, lotti sommati) */
  readonly catalog = computed<DeliveryProduct[]>(() => {
    const siteId = this.backend.currentSite()?.id;
    const lots = this.backend.inventories().filter(inv => inv.siteId === siteId);
    const productIds = Array.from(new Set(lots.map(l => l.productId)));

    return productIds.map(productId => {
      const product = this.backend.getProduct(productId);
      const productLots = lots.filter(l => l.productId === productId);
      const stock = productLots.reduce((sum, l) => sum + l.stock, 0);
      // Scadenza più vicina tra i lotti
      const earliest = productLots.map(l => l.expiry).sort()[0] ?? '';
      const [year, month, day] = earliest.split('-');

      return {
        id: productId,
        name: product?.name ?? productLots[0].productName,
        icon: product?.icon ?? 'bag',
        category: product?.category ?? 'Altro',
        stock,
        expiry: earliest ? `${day}/${month}/${year}` : '',
        expiryWarning: productLots.some(l => l.isExpiringSoon),
        price: product?.price ?? 0,
        outOfStock: stock <= 0
      };
    });
  });

  /** Solo i prodotti con quantità maggiore di 0 */
  readonly selectedItems = computed<DeliverySelectionItem[]>(() => {
    const quantities = this._quantities();
    return this.catalog()
      .filter(p => (quantities[p.id] ?? 0) > 0)
      .map(p => ({ id: p.id, name: p.name, unitTokenCost: p.price, quantity: quantities[p.id] }));
  });

  // Totali della selezione (stesso calcolo per lista, riepilogo e conferma)
  readonly totalUnits = computed(() => this.selectedItems().reduce((sum, i) => sum + i.quantity, 0));
  readonly totalTokens = computed(() => this.selectedItems().reduce((sum, i) => sum + i.unitTokenCost * i.quantity, 0));
  // Saldo previsto dopo la conferma (il saldo effettivo non cambia finché non si conferma)
  readonly remainingTokens = computed(() => this.balance() - this.totalTokens());

  quantityOf(productId: string): number {
    return this._quantities()[productId] ?? 0;
  }

  /** Inizia una consegna per un beneficiario: se cambia, la selezione riparte da zero */
  start(beneficiaryId: string): void {
    if (this._beneficiaryId() !== beneficiaryId) {
      this._beneficiaryId.set(beneficiaryId);
      this._quantities.set({});
    }
  }

  // Si può aumentare solo entro la giacenza e il saldo token disponibile
  canIncrement(productId: string): boolean {
    const product = this.catalog().find(p => p.id === productId);
    if (!product || product.outOfStock) return false;
    return this.quantityOf(productId) + 1 <= product.stock
      && this.totalTokens() + product.price <= this.balance();
  }

  increment(productId: string): void {
    if (!this.canIncrement(productId)) return;
    this._quantities.update(q => ({ ...q, [productId]: (q[productId] ?? 0) + 1 }));
  }

  // Diminuisce (mai sotto 0); a 0 il prodotto esce dalla selezione
  decrement(productId: string): void {
    const current = this.quantityOf(productId);
    if (current <= 0) return;
    this._quantities.update(q => {
      const next = { ...q, [productId]: current - 1 };
      if (next[productId] <= 0) delete next[productId];
      return next;
    });
  }

  /**
   * Conferma la consegna: salva l'operazione, scala i token e le giacenze (backend.registerDelivery).
   * Solo se riesce conserva i dati dell'operazione per la pagina di successo e svuota la selezione.
   * Se fallisce lancia l'errore e lascia selezione e saldo invariati.
   */
  async confirm(): Promise<ConfirmedDelivery> {
    const beneficiary = this.beneficiary();
    const site = this.backend.currentSite();
    if (!beneficiary || !site) throw new Error('Beneficiario o sede mancanti');

    const items = this.selectedItems();
    if (items.length === 0) throw new Error('Nessun prodotto selezionato');

    // Copia dei dati PRIMA di svuotare la selezione
    const beneficiaryName = `${beneficiary.firstName} ${beneficiary.lastName}`;
    const totalUnits = this.totalUnits();

    const { delivery } = await this.backend.registerDelivery({
      beneficiaryId: beneficiary.id,
      siteId: site.id,
      date: this.backend.todayIso(),
      items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
    });

    const confirmed: ConfirmedDelivery = {
      beneficiaryName,
      items: items.map(i => ({ name: i.name, quantity: i.quantity })),
      totalUnits,
      tokensUsed: delivery.tokensUsed,
      remainingTokens: this.balance(), // saldo già aggiornato dal servizio
      maxTokens: this.maxTokens()
    };

    this._lastConfirmed.set(confirmed);
    this._quantities.set({});
    return confirmed;
  }
}
