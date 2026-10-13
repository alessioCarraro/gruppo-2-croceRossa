import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { App, Product, Screen } from './app';
import { AppTitleComponent } from './shared/app-title.component';

@Component({
  selector: 'app-admin-screens',
  standalone: true,
  imports: [FormsModule, KeyValuePipe, AppTitleComponent],
  templateUrl: './admin-screens.html',
})
export class AdminScreensComponent {
  protected readonly app = inject(App);
  readonly products: Product[] = this.app.products;
  readonly screen = this.app.screen;
  readonly requests = this.app.requests;
  readonly received = this.app.received;
  readonly order = this.app.order;
  readonly cart = this.app.cart;
  readonly cartItems = this.app.cartItems;
  readonly cartCount = this.app.cartCount;
  readonly orderItems = this.app.orderItems;
  readonly filteredProducts = this.app.filteredProducts;
  readonly remaining = this.app.remaining;
  readonly used = this.app.used;
  readonly orderSheetOpen = signal(false);
  get search(): string { return this.app.search; }
  set search(value: string) { this.app.search = value; }
  get category(): string { return this.app.category; }
  set category(value: string) { this.app.category = value; }
  go(screen: Screen): void { this.app.go(screen); }
  add(id: string): void { this.app.add(id); }
  remove(id: string): void { this.app.remove(id); }
  addOrder(id: string, name?: string): void { this.app.addOrder(id, name); }
  manageRequest(): void { this.app.manageRequest(); }
  confirmDelivery(): void { this.app.confirmDelivery(); }
  confirmReceipt(): void { this.app.confirmReceipt(); }
  showToast(message: string): void { this.app.showToast(message); }
  inOrder(id: string): boolean { return this.app.inOrder(id); }
  openOrderSheet(): void { this.orderSheetOpen.set(true); }
  closeOrderSheet(): void { this.orderSheetOpen.set(false); }
  sendOrder(): void { this.orderSheetOpen.set(false); this.showToast('Ordine inviato al magazzino centrale'); }
}
