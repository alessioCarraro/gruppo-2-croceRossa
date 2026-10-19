import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BaseProduct {
  id: string;
  name: string;
  stockMagazzino: number;
  stockSede: number;
  requestedQty: number;
  isAvailable: boolean;
}

interface ProductRequest extends BaseProduct {
  expiryDate?: string;
}

interface CatalogItem extends BaseProduct {
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
export class AdminMetroRestockSingleStoreComponent {
  // Signal che tiene traccia del numero totale di articoli (singole unità) nel carrello
  public cartCount = signal<number>(0);
  
  public activeCategory = signal<string>('Tutti');
  public categories = signal<string[]>(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Bevande']);

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
      requestedQty: 0,
      isAvailable: true
    }
  ]);

  public storeCatalog = signal<CatalogItem[]>([
    {
      id: 'cat_1',
      name: 'Pasta integrale 500g',
      stockMagazzino: 820,
      stockSede: 8,
      expiryDate: '03/11/2025',
      isExpiringSoon: true,
      requestedQty: 0,
      isAvailable: true
    },
    {
      id: 'cat_2',
      name: 'Riso Carnaroli 1kg',
      stockMagazzino: 1200,
      stockSede: 24,
      expiryDate: '10/08/2026',
      isExpiringSoon: false,
      requestedQty: 0,
      isAvailable: true
    }
  ]);

  public goBack(): void {
    console.log('Navigazione indietro');
  }

  public selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  // --- Gestione Richieste Sede ---
  public updateRequestQuantity(itemId: string, delta: number): void {
    this.storeRequests.update(reqs => 
      reqs.map(req => {
        if (req.id === itemId && req.isAvailable) {
          return { ...req, requestedQty: Math.max(0, req.requestedQty + delta) };
        }
        return req;
      })
    );
  }

  public addRequestToCart(item: ProductRequest): void {
    if (item.isAvailable && item.requestedQty > 0) {
      // FIX: Aggiungiamo la quantità richiesta effettivamente, non "+ 1"
      this.cartCount.update(count => count + item.requestedQty);
      
      // Rimuove l'elemento dalle richieste dopo l'aggiunta al carrello
      this.storeRequests.update(reqs => reqs.filter(r => r.id !== item.id));
      console.log(`Aggiunti ${item.requestedQty} pezzi di ${item.name} dalle richieste`);
    }
  }

  // --- Gestione Catalogo Magazzino ---
  public updateCatalogQuantity(itemId: string, delta: number): void {
    this.storeCatalog.update(cats => 
      cats.map(cat => {
        if (cat.id === itemId && cat.isAvailable) {
          return { ...cat, requestedQty: Math.max(0, cat.requestedQty + delta) };
        }
        return cat;
      })
    );
  }

  public addCatalogToCart(item: CatalogItem): void {
    if (item.isAvailable && item.requestedQty > 0) {
      // FIX: Aggiungiamo la quantità richiesta effettivamente, non "+ 1"
      this.cartCount.update(count => count + item.requestedQty);
      
      // Resetta la quantità del catalogo dopo l'aggiunta, senza far sparire la card
      this.storeCatalog.update(cats => 
        cats.map(cat => cat.id === item.id ? { ...cat, requestedQty: 0 } : cat)
      );
      console.log(`Aggiunti ${item.requestedQty} pezzi di ${item.name} dal catalogo`);
    }
  }

  public reviewOrder(): void {
    console.log(`Revisione ordine in corso... (Totale pezzi: ${this.cartCount()})`);
  }
}