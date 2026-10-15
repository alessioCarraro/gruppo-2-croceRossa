import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductItem {
  id: string;
  name: string;
  description: string;
  status: string;
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
  // Gestione dello stato tramite Signals
  readonly orderInfo = signal<OrderInfo>({
    orderId: 'ORD-2025-114',
    title: 'Nuovo ordine',
    destination: 'Magazzino Centrale',
    role: 'Admin'
  });

  readonly products = signal<ProductItem[]>([
    {
      id: '1',
      name: 'Omogeneizzato carne',
      description: 'Richiesta · Negozio Parabiago',
      status: 'in ordine'
    },
    {
      id: '2',
      name: 'Olio di semi 1L',
      description: 'Sotto soglia · sede',
      status: 'in ordine'
    }
  ]);

  readonly infoMessage = signal<string>(
    'Include i prodotti accettati dalle richieste sedi. Un prodotto già inserito non è più selezionabile nel catalogo.'
  );

  // Derivazioni
  readonly hasProducts = computed(() => this.products().length > 0);

  // Azioni
  goBack(): void {
    console.log('Navigazione: Indietro');
  }

  submitOrder(): void {
    console.log('Invio ordine:', this.orderInfo().orderId);
  }
}
