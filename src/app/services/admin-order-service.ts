import { Injectable, computed, effect, signal } from '@angular/core';

export interface AdminOrderItem {
  productId: string;
  name: string;
  description: string;
  quantity: number;
}

const ORDER_STORAGE_KEY = 'cri_admin_order';

/**
 * Bozza dell'ordine al magazzino centrale dell'Admin.
 * Condivisa tra "Magazzino" (pulsante Ordina e badge) e "Ordine" (elenco e invio).
 * È salvata nel localStorage: restano anche cambiando pagina o ricaricando.
 */
@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private readonly _items = signal<AdminOrderItem[]>(this.loadSaved());

  readonly items = this._items.asReadonly();
  // Numero di prodotti nell'ordine (badge del Magazzino)
  readonly count = computed(() => this._items().length);

  constructor() {
    // Salva la bozza a ogni modifica
    effect(() => this.save(this._items()));
  }

  has(productId: string): boolean {
    return this._items().some(i => i.productId === productId);
  }

  // Aggiunge un prodotto (se è già nell'ordine non crea righe doppie)
  add(item: AdminOrderItem): void {
    if (this.has(item.productId)) return;
    this._items.update(items => [...items, item]);
  }

  // Cambia la quantità di una riga (minimo 1)
  setQuantity(productId: string, quantity: number): void {
    const safe = Math.max(1, Math.floor(quantity));
    this._items.update(items => items.map(i => i.productId === productId ? { ...i, quantity: safe } : i));
  }

  remove(productId: string): void {
    this._items.update(items => items.filter(i => i.productId !== productId));
  }

  // Svuota la bozza (dopo l'invio riuscito)
  clear(): void {
    this._items.set([]);
  }

  private loadSaved(): AdminOrderItem[] {
    try {
      const raw = localStorage.getItem(ORDER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AdminOrderItem[]) : [];
    } catch {
      return [];
    }
  }

  private save(items: AdminOrderItem[]): void {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(items));
    } catch { /* nessun salvataggio: la bozza resta solo in memoria */ }
  }
}
