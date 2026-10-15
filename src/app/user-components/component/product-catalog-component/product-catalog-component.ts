import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  icon: 'bag' | 'bottle' | 'meat';
  stock: number;
  expiry: string;
  price: number;
  quantity: number;
  expiryWarning?: boolean;
  outOfStock?: boolean;
  inOrder?: boolean;
}

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-catalog-component.html',
  styleUrls: ['./product-catalog-component.css']
})
export class ProductCatalogComponent {
  // Stato
  readonly searchQuery = signal('');
  readonly selectedCategory = signal('Tutti');
  readonly categories = signal(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Verdura']);
  
  readonly products = signal<Product[]>([
    { id: '1', name: 'Pasta di semola 500g', icon: 'bag', stock: 420, expiry: '15/05/2026', price: 20, quantity: 1 },
    { id: '2', name: 'Pasta integrale 500g', icon: 'bag', stock: 58, expiry: '02/11/2025', price: 22, quantity: 0, expiryWarning: true },
    { id: '3', name: 'Passata di pomodoro 700g', icon: 'bottle', stock: 300, expiry: '20/08/2026', price: 15, quantity: 2 },
    { id: '4', name: 'Petto di pollo 1kg', icon: 'meat', stock: 25, expiry: '30/10/2025', price: 40, quantity: 0, expiryWarning: true },
    { id: '5', name: 'Omogeneizzato carne', icon: 'bottle', stock: 0, expiry: '', price: 0, quantity: 0, outOfStock: true, inOrder: true }
  ]);

  // Stato derivato
  readonly totalItems = computed(() => 
    this.products().reduce((acc, p) => acc + p.quantity, 0)
  );

  // Azioni
  goBack(): void {
    console.log('Indietro');
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  incrementQuantity(product: Product): void {
    if (product.outOfStock) return;
    this.products.update(prods => 
      prods.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
    );
  }

  decrementQuantity(product: Product): void {
    if (product.quantity > 0) {
      this.products.update(prods => 
        prods.map(p => p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p)
      );
    }
  }

  goToSummary(): void {
    console.log(`Vai al riepilogo: ${this.totalItems()} articoli`);
  }
}
