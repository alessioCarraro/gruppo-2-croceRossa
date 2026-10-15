import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserInfo {
  name: string;
  orderId: string;
  remainingTokens: number;
  initialTokens: number;
}

interface Product {
  id: number;
  name: string;
  unitTokenCost: number;
  quantity: number;
  weight: string;
}

@Component({
  selector: 'app-admin-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-summary-component.html',
  styleUrls: ['./admin-summary-component.css']
})
export class AdminSummaryComponent {
  // Stato Utente
  public readonly userInfo = signal<UserInfo>({
    name: 'Mario Rossi',
    orderId: 'ID...0481',
    remainingTokens: 370,
    initialTokens: 575
  });

  // Stato Prodotti
  public readonly products = signal<Product[]>([
    {
      id: 1,
      name: 'Pasta di semola',
      weight: '500g',
      unitTokenCost: 20,
      quantity: 1
    },
    {
      id: 2,
      name: 'Passata di pomodoro',
      weight: '700g',
      unitTokenCost: 15,
      quantity: 2
    }
  ]);

  // Stato Derivato (Computed) per il totale dei token usati
  public readonly totalTokensUsed = computed(() => {
    return this.products().reduce((total, product) => total + (product.unitTokenCost * product.quantity), 0);
  });

  // Azioni
  public incrementQuantity(productId: number): void {
    this.products.update(prods => 
      prods.map(p => p.id === productId ? { ...p, quantity: p.quantity + 1 } : p)
    );
  }

  public decrementQuantity(productId: number): void {
    this.products.update(prods => 
      prods.map(p => (p.id === productId && p.quantity > 0) ? { ...p, quantity: p.quantity - 1 } : p)
    );
  }

  public confirmDelivery(): void {
    console.log('Consegna confermata. Token utilizzati:', this.totalTokensUsed());
  }
}
