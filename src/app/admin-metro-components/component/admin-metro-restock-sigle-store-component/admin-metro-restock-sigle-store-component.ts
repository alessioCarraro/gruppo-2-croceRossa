import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { RestockCartService } from '../../../services/restock-cart-service';

interface BaseProduct {
  id: string;
  productId?: string; // id del prodotto nel catalogo (usato dal carrello)
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
  protected readonly route = inject(ActivatedRoute);
  protected readonly location = inject(Location);
  protected readonly backend = inject(MockBackendService);
  protected readonly router = inject(Router);
  protected readonly cart = inject(RestockCartService);

  // Sede scelta nella pagina "Rifornitura sedi" (?siteId=...)
  protected readonly siteId = this.route.snapshot.queryParamMap.get('siteId') ?? '';

  // Nome della sede mostrato nel titolo
  public siteName = computed(() => this.backend.getSiteName(this.siteId));

  // Numero richieste: stesso calcolo del badge nella lista "Rifornitura sedi"
  public requestCount = computed(() => this.backend.restockRequestCount(this.siteId));

  // Numero totale di pezzi nel carrello condiviso (badge del carrello)
  public cartCount = this.cart.totalQuantity;

  public activeCategory = signal<string>('Tutti');
  public categories = signal<string[]>(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Bevande']);

  // Quantità scelte (per richiesta) nell'elenco delle richieste della sede
  private readonly requestQuantities = signal<Record<string, number>>({});

  /**
   * Richieste della sede lette dal servizio (stessa fonte del badge).
   * Sono "computed": quando una richiesta passa a 'Nel carrello' o 'Inviata' nel servizio
   * sparisce da sola, anche se si esce e si rientra nella pagina.
   */
  public storeRequests = computed<ProductRequest[]>(() => {
    const quantities = this.requestQuantities();
    return this.loadStoreRequests().map(req => ({ ...req, requestedQty: quantities[req.id] ?? 0 }));
  });

  // Testo della ricerca e quantità scelte (per prodotto) nel catalogo
  public searchQuery = signal<string>('');
  private readonly catalogQuantities = signal<Record<string, number>>({});

  /**
   * Catalogo magazzino: prodotti della metro che corrispondono alla ricerca.
   * Finché non si scrive nulla la lista resta vuota (nessun dato di esempio).
   */
  public storeCatalog = computed<CatalogItem[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    const metro = this.backend.sites().find(s => s.type === 'Metro');
    const category = this.activeCategory();
    const quantities = this.catalogQuantities();

    return this.backend.inventories()
      .filter(inv => inv.siteId === metro?.id)
      .map(inv => ({ inv, product: this.backend.getProduct(inv.productId) }))
      .filter(({ inv, product }) =>
        (product?.name ?? inv.productName).toLowerCase().includes(query) &&
        (category === 'Tutti' || product?.category === category)
      )
      .map(({ inv, product }) => {
        const [year, month, day] = inv.expiry.split('-');
        return {
          id: inv.productId,
          productId: inv.productId,
          name: product?.name ?? inv.productName,
          stockMagazzino: inv.stock,
          stockSede: inv.stock, // "Quantità in Metro"
          expiryDate: `${day}/${month}/${year}`,
          isExpiringSoon: inv.isExpiringSoon,
          requestedQty: quantities[inv.productId] ?? 0,
          isAvailable: inv.stock > 0
        };
      });
  });

  public updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  /** Apre il riepilogo con i prodotti aggiunti al carrello */
  public openCart(): void {
    this.router.navigate(['/user-metro-restock-summary']);
  }

  public goBack(): void {
    this.location.back();
  }

  /** Trasforma le richieste della sede (dal servizio) nelle card mostrate in pagina */
  private loadStoreRequests(): ProductRequest[] {
    const metro = this.backend.sites().find(s => s.type === 'Metro');
    const inventories = this.backend.inventories();

    return this.backend.restockRequestsForSite(this.siteId).map(request => {
      const product = request.productId ? this.backend.getProduct(request.productId) : undefined;
      const metroInv = inventories.find(i => i.siteId === metro?.id && i.productId === request.productId);
      const [year, month, day] = (metroInv?.expiry ?? '').split('-');

      return {
        id: request.id,
        productId: request.productId,
        name: product?.name ?? 'Prodotto sconosciuto',
        stockMagazzino: metroInv?.stock ?? 0,
        stockSede: metroInv?.stock ?? 0,
        expiryDate: metroInv ? `${day}/${month}/${year}` : undefined,
        requestedQty: 0,
        isAvailable: (metroInv?.stock ?? 0) > 0
      };
    });
  }

  public selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  // --- Gestione Richieste Sede ---
  public updateRequestQuantity(itemId: string, delta: number): void {
    const req = this.storeRequests().find(r => r.id === itemId);
    if (!req || !req.isAvailable) return;

    const next = Math.max(0, req.requestedQty + delta);
    this.requestQuantities.update(q => ({ ...q, [itemId]: next }));
  }

  public addRequestToCart(item: ProductRequest): void {
    if (item.isAvailable && item.requestedQty > 0 && item.productId) {
      // Aggiunge al carrello condiviso: la richiesta passa a 'Nel carrello' nel servizio
      // e sparisce da questo elenco (anche tornando indietro dal carrello)
      this.cart.addItem(this.siteId, item.productId, item.name, item.requestedQty, item.id);
    }
  }

  // --- Gestione Catalogo Magazzino ---
  public updateCatalogQuantity(itemId: string, delta: number): void {
    const item = this.storeCatalog().find(c => c.id === itemId);
    if (!item || !item.isAvailable) return;

    // La quantità va da 0 alla giacenza disponibile in metro
    const next = Math.min(item.stockMagazzino, Math.max(0, item.requestedQty + delta));
    this.catalogQuantities.update(q => ({ ...q, [itemId]: next }));
  }

  public addCatalogToCart(item: CatalogItem): void {
    if (item.isAvailable && item.requestedQty > 0 && item.productId) {
      // Se il prodotto è già nel carrello la quantità viene sommata (nessun duplicato)
      this.cart.addItem(this.siteId, item.productId, item.name, item.requestedQty);

      // Riporta a 0 la quantità scelta, senza far sparire la card
      this.catalogQuantities.update(q => ({ ...q, [item.id]: 0 }));
    }
  }

  public reviewOrder(): void {
    console.log(`Revisione ordine in corso... (Totale pezzi: ${this.cartCount()})`);
  }
}