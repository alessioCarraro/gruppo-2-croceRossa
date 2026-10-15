import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: string;
  name: string;
  stock: number;
  expiryDate?: string;
  weightInfo: string;
  icon: string;
  addedToOrder: boolean;
  category: string;
}

@Component({
  selector: 'app-admin-warehouse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-warehouse-component.html',
  styleUrls: ['./admin-warehouse-component.css']
})
export class AdminWarehouseComponent {
  // Stato
  searchQuery = signal<string>('');
  activeCategory = signal<string>('Tutti');
  categories = ['Tutti', 'Pasta', 'Omogeneizzati', 'Carne'];
  
  // Dati di mock basati sull'immagine
  products = signal<Product[]>([
    {
      id: '1',
      name: 'Pasta di semola 500g',
      stock: 420,
      expiryDate: '15/05/2026',
      weightInfo: '20 T',
      icon: 'bag',
      addedToOrder: false,
      category: 'Pasta'
    },
    {
      id: '2',
      name: 'Pasta integrale 500g',
      stock: 58,
      expiryDate: '02/11/2025',
      weightInfo: '22 T',
      icon: 'bag',
      addedToOrder: false,
      category: 'Pasta'
    },
    {
      id: '3',
      name: 'Petto di pollo 1kg',
      stock: 25,
      expiryDate: '30/10/2025',
      weightInfo: '40 T',
      icon: 'meat',
      addedToOrder: false,
      category: 'Carne'
    },
    {
      id: '4',
      name: 'Omogeneizzato carne',
      stock: 0,
      weightInfo: '30 T',
      icon: 'jar',
      addedToOrder: true,
      category: 'Omogeneizzati'
    }
  ]);

  // Derivazioni
  filteredProducts = computed(() => {
    const category = this.activeCategory();
    const query = this.searchQuery().toLowerCase();
    
    return this.products().filter(p => {
      const matchCategory = category === 'Tutti' || p.category === category;
      const matchQuery = p.name.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  });

  orderCount = computed(() => this.products().filter(p => p.addedToOrder).length);

  // Azioni
  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  addToOrder(productId: string): void {
    this.products.update(products => 
      products.map(p => p.id === productId ? { ...p, addedToOrder: true } : p)
    );
  }
}