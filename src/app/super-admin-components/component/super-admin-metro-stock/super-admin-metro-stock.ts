import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InventoryItem {
  id: string;
  name: string;
  stock: string;
  expiryDate: string;
  isExpiringSoon: boolean;
  tokenValue: number;
  iconType: 'bag' | 'bottle' | 'meat' | 'jar';
}

@Component({
  selector: 'app-super-admin-metro-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-metro-stock.html',
  styleUrls: ['./super-admin-metro-stock.css']
})
export class SuperAdminMetroStockComponent {
  readonly totalArticles = signal<string>('1.284 art.');
  
  readonly categories = signal<string[]>(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Latticini']);
  readonly activeCategory = signal<string>('Tutti');

  readonly items = signal<InventoryItem[]>([
    {
      id: '1',
      name: 'Pasta di semola 500g',
      stock: '3.400',
      expiryDate: '15/05/2026',
      isExpiringSoon: false,
      tokenValue: 20,
      iconType: 'bag'
    },
    {
      id: '2',
      name: 'Pasta integrale 500g',
      stock: '820',
      expiryDate: '02/11/2025',
      isExpiringSoon: true,
      tokenValue: 22,
      iconType: 'bag'
    },
    {
      id: '3',
      name: 'Passata di pomodoro 700g',
      stock: '2.150',
      expiryDate: '20/08/2026',
      isExpiringSoon: false,
      tokenValue: 15,
      iconType: 'bottle'
    },
    {
      id: '4',
      name: 'Petto di pollo 1kg',
      stock: '160',
      expiryDate: '30/10/2025',
      isExpiringSoon: true,
      tokenValue: 40,
      iconType: 'meat'
    },
    {
      id: '5',
      name: 'Omogeneizzato frutta',
      stock: '540',
      expiryDate: '05/12/2025',
      isExpiringSoon: false,
      tokenValue: 30,
      iconType: 'jar'
    }
  ]);

  selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  goBack(): void {
    console.log('Naviga indietro');
  }

  editItem(item: InventoryItem): void {
    console.log('Modifica token per:', item.name);
  }
}