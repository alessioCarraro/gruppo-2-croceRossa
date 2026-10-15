import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppBarComponent } from '../app/shared/app-bar.component';

type Product = { name: string; cost: number; category: string };
type UserScreen = 'login' | 'home' | 'catalog' | 'summary' | 'success' | 'card' | 'history';
const screens: UserScreen[] = ['login', 'home', 'catalog', 'summary', 'success', 'card', 'history'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AppBarComponent],
  templateUrl: './user-app.html',
  styleUrl: './user-app.css',
})
export class UserApp {
  readonly products: Product[] = [
    { name: 'Pasta di semola 500g', cost: 20, category: 'Dispensa' },
    { name: 'Passata di pomodoro 700g', cost: 15, category: 'Dispensa' },
    { name: 'Petto di pollo 1kg', cost: 40, category: 'Freschi' },
    { name: 'Omogeneizzato carne', cost: 30, category: 'Infanzia' },
  ];
  readonly cart = signal<Record<string, number>>({ 'Pasta di semola 500g': 1 });
  readonly screen = signal<UserScreen>(screens.includes(location.pathname.slice(1) as UserScreen) ? location.pathname.slice(1) as UserScreen : 'login');
  readonly toast = signal('');
  username = 'm.turelli';
  password = 'password';
  search = '';
  category = 'Tutti';
  readonly filtered = computed(() => this.products.filter((product) =>
    (this.category === 'Tutti' || product.category === this.category) &&
    product.name.toLowerCase().includes(this.search.toLowerCase()),
  ));
  readonly used = computed(() => Object.entries(this.cart()).reduce((total, [name, quantity]) =>
    total + (this.products.find((product) => product.name === name)?.cost ?? 0) * quantity, 0));
  readonly remaining = computed(() => 420 - this.used());
  readonly count = computed(() => Object.values(this.cart()).reduce((total, quantity) => total + quantity, 0));
  go(screen: UserScreen): void {
    this.screen.set(screen);
    history.replaceState({}, '', `/${screen}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  add(name: string): void { this.cart.update((cart) => ({ ...cart, [name]: (cart[name] ?? 0) + 1 })); }
  remove(name: string): void { this.cart.update((cart) => { const next = { ...cart, [name]: (cart[name] ?? 1) - 1 }; if (next[name] <= 0) delete next[name]; return next; }); }
  login(): void { this.go('home'); }
  notify(message: string): void { this.toast.set(message); window.setTimeout(() => this.toast.set(''), 2200); }
}
