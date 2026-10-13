import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { AppTitleComponent } from './app-title.component';

export type Screen = 'dashboard' | 'approvals' | 'identify' | 'person' | 'delivery' | 'summary' | 'success' | 'catalog' | 'order' | 'packages' | 'arrived' | 'transit' | 'low' | 'sites' | 'expiry';
type Product = { id: string; name: string; category: string; stock: number; cost: number; expiry: string };
const screens: Screen[] = ['dashboard', 'approvals', 'identify', 'person', 'delivery', 'summary', 'success', 'catalog', 'order', 'packages', 'arrived', 'transit', 'low', 'sites', 'expiry'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, KeyValuePipe, AppTitleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly products: Product[] = [
    { id: 'pasta', name: 'Pasta di semola 500g', category: 'Pasta', stock: 420, cost: 20, expiry: '15/05/2026' },
    { id: 'integrale', name: 'Pasta integrale 500g', category: 'Pasta', stock: 58, cost: 22, expiry: '02/11/2025' },
    { id: 'passata', name: 'Passata di pomodoro 700g', category: 'Verdura', stock: 300, cost: 15, expiry: '20/08/2026' },
    { id: 'pollo', name: 'Petto di pollo 1kg', category: 'Carne', stock: 25, cost: 40, expiry: '30/10/2025' },
    { id: 'omo', name: 'Omogeneizzato carne', category: 'Omogeneizzati', stock: 0, cost: 30, expiry: '05/12/2025' },
  ];
  readonly screen = signal<Screen>(screens.includes(location.pathname.slice(1) as Screen) ? location.pathname.slice(1) as Screen : 'dashboard');
  readonly cart = signal<Record<string, number>>({ pasta: 1, passata: 2 });
  readonly order = signal<Record<string, number>>({ omo: 120, olio: 150 });
  readonly requests = signal(3);
  readonly received = signal(false);
  search = '';
  category = 'Tutti';
  toast = signal('');
  readonly filteredProducts = computed(() => this.products.filter(p => (this.category === 'Tutti' || p.category === this.category) && p.name.toLowerCase().includes(this.search.toLowerCase())));
  readonly cartItems = computed(() => Object.entries(this.cart()).map(([id, qty]) => ({ product: this.products.find(p => p.id === id)!, qty })).filter(x => x.product));
  readonly used = computed(() => this.cartItems().reduce((sum, x) => sum + x.product.cost * x.qty, 0));
  readonly remaining = computed(() => 575 - this.used());
  readonly cartCount = computed(() => this.cartItems().reduce((sum, x) => sum + x.qty, 0));
  readonly orderItems = computed(() => Object.entries(this.order()).map(([id, qty]) => ({ product: this.products.find(p => p.id === id) ?? { id, name: id === 'olio' ? 'Olio di semi 1L' : 'Prodotto richiesto', category: 'Dispensa', stock: 0, cost: 0, expiry: '' }, qty })));

  go(screen: Screen): void { this.screen.set(screen); history.replaceState({}, '', `/${screen}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  add(id: string): void { const p = this.products.find(x => x.id === id); if (!p?.stock) return; this.cart.update(c => ({ ...c, [id]: (c[id] ?? 0) + 1 })); }
  remove(id: string): void { this.cart.update(c => { const next = { ...c, [id]: (c[id] ?? 1) - 1 }; if (next[id] <= 0) delete next[id]; return next; }); }
  addOrder(id: string, name?: string): void { this.order.update(o => ({ ...o, [id]: o[id] ?? 100 })); this.showToast(`${name ?? 'Prodotto'} aggiunto all'ordine`); }
  manageRequest(): void { this.requests.update(n => Math.max(0, n - 1)); this.showToast('Richiesta gestita'); }
  confirmDelivery(): void { this.go('success'); this.showToast('Consegna registrata'); }
  confirmReceipt(): void { if (this.received()) return; this.received.set(true); this.showToast('Ricezione confermata'); }
  showToast(message: string): void { this.toast.set(message); window.setTimeout(() => this.toast.set(''), 2200); }
  inOrder(id: string): boolean { return id in this.order(); }
}
