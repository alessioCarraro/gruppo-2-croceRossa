import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrderProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

@Component({
  selector: 'app-super-admin-request-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-request-details-component.html',
  styleUrls: ['./super-admin-request-details-component.css']
})
export class SuperAdminRequestDetailsComponent {
  readonly orderInfo = signal({
    status: 'In attesa',
    location: 'Negozio Parabiago',
    admin: 'Luca Beretta',
    date: '15/10/2026',
    time: '09:20'
  });

  readonly requestedProducts = signal<OrderProduct[]>([
    { id: '1', name: 'Pasta di semola 500g', category: 'Alimentari · Pasta', quantity: 120 },
    { id: '2', name: 'Olio di semi 1L', category: 'Alimentari · Olio', quantity: 40 },
    { id: '3', name: 'Omogeneizzato frutta', category: 'Infanzia · Omogeneizzati', quantity: 60 },
    { id: '4', name: 'Passata di pomodoro 700g', category: 'Alimentari · Verdure', quantity: 30 }
  ]);

  // Logica per aumentare la quantità
  increaseQuantity(id: string): void {
    this.requestedProducts.update(products =>
      products.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p)
    );
  }

  // Logica per diminuire la quantità (minimo 1)
  decreaseQuantity(id: string): void {
    this.requestedProducts.update(products =>
      products.map(p => p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)
    );
  }

  // Logica per rimuovere completamente il prodotto
  removeProduct(id: string): void {
    this.requestedProducts.update(products => 
      products.filter(p => p.id !== id)
    );
  }

  goBack(): void {
    console.log('Azione: Torna indietro');
  }

  confirmRequest(): void {
    console.log('Azione: Conferma richiesta', this.requestedProducts());
  }

  returnToApprovals(): void {
    console.log('Azione: Torna alle approvazioni');
  }
}