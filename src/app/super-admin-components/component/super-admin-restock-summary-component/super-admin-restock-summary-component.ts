import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-super-admin-restock-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-restock-summary-component.html',
  styleUrls: ['./super-admin-restock-summary-component.css']
})
export class SuperAdminRestockSummary {
  public locationLabel = signal<string>('Sede1');

  public orderItems = signal<OrderItem[]>([
    { id: '1', name: 'Pasta di semola 500g', quantity: 120 },
    { id: '2', name: 'Omogeneizzato frutta', quantity: 60 },
    { id: '3', name: 'Passata di pomodoro 700g', quantity: 45 }
  ]);

  public goBack(): void {
    console.log('Navigating back...');
  }

  public removeItem(itemId: string): void {
    this.orderItems.update(items => items.filter(item => item.id !== itemId));
  }

  public submitOrder(): void {
    console.log('Invio ordine a richiesta di approvazione...', this.orderItems());
  }
}
