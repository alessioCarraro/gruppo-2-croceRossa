import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductRequest {
  id: string;
  name: string;
  stockMagazzino: number;
  stockSede: number;
  expiryDate?: string;
  requestedQty: number;
  isAvailable: boolean;
}

interface CatalogItem {
  id: string;
  name: string;
  stockMagazzino: number;
  stockSede: number;
  expiryDate: string;
  isExpiringSoon: boolean;
}

@Component({
  selector: 'app-admin-metro-restock-single-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-restock-sigle-store-component.html',
  styleUrls: ['./admin-metro-restock-sigle-store-component.css']
})
export class AdminMetroRestockSigleStoreComponent {
  public cartCount = signal<number>(0);
  public activeCategory = signal<string>('Tutti');
  
  public categories = signal<string[]>(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Bevande']);

  // Dati fedeli alla sezione "Richieste della sede"
  public storeRequests = signal<ProductRequest[]>([
    {
      id: 'req_1',
      name: 'Pasta di semola 500g',
      stockMagazzino: 3400,
      stockSede: 12,
      expiryDate: '15/05/2026',
      requestedQty: 0,
      isAvailable: true
    },
    {
      id: 'req_2',
      name: 'Olio di semi 1L',
      stockMagazzino: 0,
      stockSede: 0,
      requestedQty: 0,
      isAvailable: false
    },
    {
      id: 'req_3',
      name: 'Omogeneizzato frutta',
      stockMagazzino: 540,
      stockSede: 5,
      expiryDate: '05/12/2025',
      requestedQty: 60,
      isAvailable: true
    }
  ]);

  // Dati fedeli alla sezione "Catalogo Magazzino" con aggiunte per allungare la lista
  public storeCatalog = signal<CatalogItem[]>([
    {
      id: 'cat_1',
      name: 'Pasta integrale 500g',
      stockMagazzino: 820,
      stockSede: 8,
      expiryDate: '03/11/2025',
      isExpiringSoon: true
    },
    {
      id: 'cat_2',
      name: 'Riso Carnaroli 1kg',
      stockMagazzino: 1200,
      stockSede: 24,
      expiryDate: '10/08/2026',
      isExpiringSoon: false
    },
    {
      id: 'cat_3',
      name: 'Passata di pomodoro 700g',
      stockMagazzino: 4500,
      stockSede: 45,
      expiryDate: '22/01/2027',
      isExpiringSoon: false
    }
  ]);

  public goBack(): void {
    console.log('Navigazione indietro');
  }

  public selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  public updateQuantity(item: ProductRequest, delta: number): void {
    if (!item.isAvailable) return;
    const newQty = item.requestedQty + delta;
    if (newQty >= 0) {
      item.requestedQty = newQty;
      // In uno scenario reale, cloneremmo l'array per preservare l'immutabilità dello stato
      this.storeRequests.update(reqs => [...reqs]);
    }
  }

  public addToCart(item: ProductRequest): void {
    if (item.isAvailable && item.requestedQty > 0) {
      this.cartCount.update(count => count + 1);
      console.log(`Aggiunto ${item.requestedQty} di ${item.name}`);
    }
  }

  public reviewOrder(): void {
    console.log('Revisione ordine in corso...');
  }
}
