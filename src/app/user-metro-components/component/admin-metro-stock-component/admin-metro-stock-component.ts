import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InventoryItem {
  id: string;
  icon: string;
  name: string;
  stock: string;
  expiryDate: string;
  quantity: number;
  isExpiringSoon: boolean;
}

@Component({
  selector: 'app-admin-metro-stock', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-stock-component.html',
  styleUrls: ['./admin-metro-stock-component.css']
})
export class AdminMetroStockComponent {
  public filters = signal<string[]>(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne']);
  public activeFilter = signal<string>('Tutti');
  
  public inventoryItems = signal<InventoryItem[]>([
    {
      id: '1',
      icon: 'bag',
      name: 'Pasta di semola 500g',
      stock: '3.400',
      expiryDate: '15/05/2026',
      quantity: 20,
      isExpiringSoon: false
    },
    {
      id: '2',
      icon: 'bag',
      name: 'Pasta integrale 500g',
      stock: '820',
      expiryDate: '02/11/2025',
      quantity: 22,
      isExpiringSoon: true
    },
    {
      id: '3',
      icon: 'bottle',
      name: 'Passata di pomodoro 700g',
      stock: '2.150',
      expiryDate: '20/08/2026',
      quantity: 15,
      isExpiringSoon: false
    },
    {
      id: '4',
      icon: 'meat',
      name: 'Petto di pollo 1kg',
      stock: '160',
      expiryDate: '30/10/2025',
      quantity: 40,
      isExpiringSoon: true
    },
    {
      id: '5',
      icon: 'jar',
      name: 'Omogeneizzato frutta',
      stock: '540',
      expiryDate: '05/12/2025',
      quantity: 30,
      isExpiringSoon: true
    }
  ]);

  public selectFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}