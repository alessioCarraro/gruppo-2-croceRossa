import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductItem {
  id: string;
  name: string;
  description: string;
}

interface OrderInfo {
  orderId: string;
  title: string;
  destination: string;
  role: string;
}

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-order-component.html',
  styleUrls: ['./admin-order-component.css']
})
export class AdminOrderComponent {
  
  readonly orderInfo = signal<OrderInfo>({
    orderId: 'ORD-2025-114',
    title: 'Nuovo ordine',
    destination: 'Magazzino Centrale',
    role: 'Admin'
  });

  // Proprietà status rimossa dall'interfaccia e dai mock data
  readonly products = signal<ProductItem[]>([
    {
      id: '1',
      name: 'Omogeneizzato carne',
      description: 'Richiesta · Negozio Parabiago'
    },
    {
      id: '2',
      name: 'Olio di semi 1L',
      description: 'Sotto soglia · sede'
    }
  ]);

  // FIX 2: infoMessage eliminato

  // Derivazioni
  readonly hasProducts = computed(() => this.products().length > 0);

  // Azioni
  goBack(): void {
    console.log('Navigazione: Indietro');
  }

  // FIX 1: Nuovo metodo per rimuovere un prodotto dalla lista dell'ordine
  removeProduct(productId: string): void {
    this.products.update(currentProducts => 
      currentProducts.filter(product => product.id !== productId)
    );
  }

  submitOrder(): void {
    if (!this.hasProducts()) return;
    console.log('Invio ordine:', this.orderInfo().orderId);
  }
}