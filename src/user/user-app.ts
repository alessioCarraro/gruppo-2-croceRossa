import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppBarComponent } from '../app/shared/app-bar.component';

type Product = { name: string; cost: number; category: string; stock: number; expiry: string; icon: string };
type UserScreen = 'login' | 'home' | 'identify' | 'catalog' | 'summary' | 'success' | 'card' | 'history' | 'network' | 'warehouse' | 'shipments';
const screens: UserScreen[] = ['login', 'home', 'identify', 'catalog', 'summary', 'success', 'card', 'history', 'network', 'warehouse', 'shipments'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AppBarComponent],
  templateUrl: './user-app.html',
  styleUrl: './user-app.css',
})
export class UserApp {
  readonly products: Product[] = [
    { name: 'Pasta di semola 500g', cost: 20, category: 'Pasta', stock: 420, expiry: '15/05/2026', icon: '▱' },
    { name: 'Pasta integrale 500g', cost: 22, category: 'Pasta', stock: 58, expiry: '02/11/2025', icon: '▱' },
    { name: 'Passata di pomodoro 700g', cost: 15, category: 'Dispensa', stock: 300, expiry: '20/08/2026', icon: '♧' },
    { name: 'Omogeneizzato frutta', cost: 30, category: 'Omogeneizzati', stock: 40, expiry: '05/12/2025', icon: '▯' },
    { name: 'Petto di pollo 1kg', cost: 40, category: 'Carne', stock: 25, expiry: '30/10/2025', icon: '♧' },
    { name: 'Omogeneizzato carne', cost: 30, category: 'Omogeneizzati', stock: 0, expiry: '', icon: '▯' },
  ];
  readonly cart = signal<Record<string, number>>({ 'Pasta di semola 500g': 1, 'Passata di pomodoro 700g': 2 });
  readonly warehouseOrder = signal<string[]>([]);
  readonly screen = signal<UserScreen>(screens.includes(location.pathname.slice(1) as UserScreen) ? location.pathname.slice(1) as UserScreen : 'login');
  readonly toast = signal('');
  readonly interviewOpen = signal(false);
  username = 'm.turelli';
  password = 'password';
  beneficiaryId = 'ID-2024-0481';
  search = '';
  networkProduct = 'Pannolini taglia 4';
  category = 'Tutti';
  readonly filtered = computed(() => this.products.filter((product) =>
    (this.category === 'Tutti' || product.category === this.category) &&
    product.name.toLowerCase().includes(this.search.toLowerCase()),
  ));
  readonly warehouseFiltered = computed(() => this.filtered().filter((product) =>
    ['Pasta di semola 500g', 'Pasta integrale 500g', 'Petto di pollo 1kg', 'Omogeneizzato carne'].includes(product.name),
  ));
  readonly used = computed(() => Object.entries(this.cart()).reduce((total, [name, quantity]) =>
    total + (this.products.find((product) => product.name === name)?.cost ?? 0) * quantity, 0));
  readonly remaining = computed(() => 420 - this.used());
  readonly count = computed(() => Object.values(this.cart()).reduce((total, quantity) => total + quantity, 0));
  readonly warehouseOrderCount = computed(() => this.warehouseOrder().length);
  go(screen: UserScreen): void {
    this.screen.set(screen);
    history.replaceState({}, '', `/${screen}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  add(name: string): void {
    const product = this.products.find((item) => item.name === name);
    if (!product || product.stock === 0) {
      this.notify('Prodotto esaurito');
      return;
    }
    this.cart.update((cart) => ({ ...cart, [name]: Math.min((cart[name] ?? 0) + 1, product.stock) }));
  }
  remove(name: string): void { this.cart.update((cart) => { const next = { ...cart, [name]: (cart[name] ?? 1) - 1 }; if (next[name] <= 0) delete next[name]; return next; }); }
  addToWarehouseOrder(name: string): void {
    this.warehouseOrder.update((order) => order.includes(name) ? order : [...order, name]);
    this.notify('Prodotto aggiunto all’ordine');
  }
  login(): void { this.go('home'); }
  identifyBeneficiary(): void { this.go('card'); }
  toggleInterview(): void { this.interviewOpen.update((open) => !open); }
  notify(message: string): void { this.toast.set(message); window.setTimeout(() => this.toast.set(''), 2200); }
}
