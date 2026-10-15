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
  searchQuery = signal<string>('');
  activeCategory = signal<string>('Tutti');
  categories = ['Tutti', 'Pasta', 'Omogeneizzati', 'Carne'];
  
  products = signal<Product[]>([
    {
      id: '1',
      name: 'Pasta di semola 500g',
      stock: 1200,
      expiryDate: '15/05/2026',
      weightInfo: '20 T',
      icon: 'bag',
      addedToOrder: true,
      category: 'Pasta'
    },
    {
      id: '2',
      name: 'Pasta integrale 500g',
      stock: 58,
      expiryDate: '02/11/2025',
      weightInfo: '22 T',
      icon: 'bag',
      addedToOrder: true,
      category: 'Pasta'
    },
    {
      id: '3',
      name: 'Petto di pollo 1kg',
      stock: 26,
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
      addedToOrder: false,
      category: 'Omogeneizzati'
    }
  ]);

  filteredProducts = computed(() => {
    const category = this.activeCategory();
    const query = this.searchQuery().toLowerCase();
    
    return this.products().filter(product => {
      const matchCategory = category === 'Tutti' || product.category === category;
      const matchQuery = product.name.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  });

  // Somma numerica dello stock totale
  readonly totalArticles = computed(() => {
    return this.products().reduce((total, product) => total + product.stock, 0);
  });

  // Formattazione nativa in standard italiano
  readonly formattedTotalArticles = computed(() => {
    return new Intl.NumberFormat('it-IT').format(this.totalArticles());
  });

  // Calcolo dei prodotti aggiunti all'ordine (riflette il badge blu sullo scontrino)
  readonly orderCount = computed(() => {
    return this.products().filter(product => product.addedToOrder).length;
  });

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  addToOrder(productId: string): void {
    this.products.update(products => 
      products.map(product => product.id === productId ? { ...product, addedToOrder: true } : product)
    );
  }
}