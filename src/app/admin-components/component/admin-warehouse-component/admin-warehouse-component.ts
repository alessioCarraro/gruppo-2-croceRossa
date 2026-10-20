import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { AdminOrderService } from '../../../services/admin-order-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

interface Product {
  id: string;
  productId: string;
  name: string;
  stock: number;
  expiryDate?: string;
  expiringSoon: boolean;
  weightInfo: string;
  icon: string;
  addedToOrder: boolean;
  category: string;
}

@Component({
  selector: 'app-admin-warehouse',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './admin-warehouse-component.html',
  styleUrls: ['./admin-warehouse-component.css']
})
export class AdminWarehouseComponent {
  private readonly router = inject(Router);
  private readonly backend = inject(MockBackendService);
  private readonly order = inject(AdminOrderService);

  searchQuery = signal<string>('');
  activeCategory = signal<string>('Tutti');
  categories = ['Tutti', 'Pasta', 'Omogeneizzati', 'Carne'];

  /**
   * Prodotti del magazzino dell'Admin: inventario della sua sede dal servizio condiviso
   * (stessi dati di Operator e Super Admin). Si aggiorna da solo quando cambiano le giacenze.
   */
  products = computed<Product[]>(() => {
    const siteId = this.backend.currentSite()?.id;

    return this.backend.inventories()
      .filter(inv => inv.siteId === siteId)
      .map(inv => {
        const product = this.backend.getProduct(inv.productId);
        const [year, month, day] = inv.expiry.split('-');
        return {
          id: `${inv.productId}|${inv.expiry}`,
          productId: inv.productId,
          name: product?.name ?? inv.productName,
          stock: inv.stock,
          expiryDate: `${day}/${month}/${year}`,
          expiringSoon: inv.isExpiringSoon,
          weightInfo: `${product?.price ?? 0} T`,
          icon: product?.iconType ?? 'bag',
          addedToOrder: this.order.has(inv.productId),
          category: product?.category ?? 'Altro'
        };
      });
  });

  filteredProducts = computed(() => {
    const category = this.activeCategory();
    const query = this.searchQuery().toLowerCase();
    
    return this.products().filter(product => {
      const matchCategory = category === 'Tutti' || product.category === category;
      const matchQuery = product.name.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  });

  // Totale articoli: somma delle giacenze di TUTTI i prodotti del magazzino
  // (non dipende da ricerca o filtri; 0 se il magazzino è vuoto)
  readonly totalArticles = computed(() => {
    return this.products().reduce((total, product) => total + product.stock, 0);
  });

  // Formattazione nativa in standard italiano
  readonly formattedTotalArticles = computed(() => {
    return new Intl.NumberFormat('it-IT').format(this.totalArticles());
  });

  // Prodotti nell'ordine (badge blu sullo scontrino): bozza condivisa con la pagina Ordine
  readonly orderCount = this.order.count;

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  // Aggiunge il prodotto alla bozza dell'ordine al magazzino centrale
  addToOrder(product: Product): void {
    this.order.add({
      productId: product.productId,
      name: product.name,
      description: product.stock > 0 ? `Giacenza ${product.stock} · ${this.backend.currentSite()?.name ?? 'sede'}` : 'Esaurito',
      // Quantità iniziale: la scorta minima del prodotto (modificabile nella pagina Ordine)
      quantity: Math.max(1, this.backend.getProduct(product.productId)?.minStock ?? 10)
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-home']);
  }

  gotoOrders(): void {
    this.router.navigate(['/admin-order']);
  }
}