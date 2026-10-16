import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: string;
  name: string;
  stockStatus: string;
  isOutOfStock: boolean;
  addedToOrder: boolean;
}

@Component({
  selector: 'app-low-stock-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-low-stock-products-component.html',
  styleUrls: ['./admin-low-stock-products-component.css']
})
export class LowStockComponent {
  // Badge notification count
  readonly notificationCount = signal<number>(7);

  // Lista prodotti mockata basata sull'immagine fornita
  readonly products = signal<Product[]>([
    {
      id: '1',
      name: 'Omogeneizzato carne',
      stockStatus: 'Esaurito',
      isOutOfStock: true,
      addedToOrder: true
    },
    {
      id: '2',
      name: 'Pasta integrale 500g',
      stockStatus: 'Stock 58 · sotto soglia',
      isOutOfStock: false,
      addedToOrder: false
    },
    {
      id: '3',
      name: 'Petto di pollo 1kg',
      stockStatus: 'Stock 25 · sotto soglia',
      isOutOfStock: false,
      addedToOrder: false
    }
  ]);

  goBack(): void {
    console.log('Naviga indietro');
  }

  /**
   * Inverte lo stato 'addedToOrder' di un prodotto specifico.
   * Utilizza l'immutabilità per aggiornare il Signal, consentendo
   * all'utente di aggiungere o rimuovere il prodotto dall'ordine.
   */
  toggleOrderStatus(productId: string): void {
    this.products.update(currentProducts =>
      currentProducts.map(product =>
        product.id === productId 
          ? { ...product, addedToOrder: !product.addedToOrder } 
          : product
      )
    );
  }
}