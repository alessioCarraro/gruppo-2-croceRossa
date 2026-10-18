import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackendService, StoreAvailabilityResult } from '../../utils';

@Component({
  selector: 'app-store-locator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-locator-component.html',
  styleUrls: ['./store-locator-component.css']
})
export class StoreLocatorComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly backendService = inject(MockBackendService);

  public readonly searchQuery = signal<string>(
    this.route.snapshot.queryParamMap.get('query') ?? ''
  );

  public onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  // Risoluzione basata esclusivamente su SiteInventory
  public readonly matchedProduct = computed<{ productId: string; productName: string } | undefined>(() => {
    const query = this.searchQuery();
    const results = this.backendService.searchInventoryProducts(query);
    return results.length > 0 ? results[0] : undefined;
  });

  public readonly productName = computed<string>(() => {
    const prod = this.matchedProduct();
    if (prod) return prod.productName;
    const query = this.searchQuery().trim();
    return query ? query : 'Nessun prodotto cercato';
  });

  public readonly productStatus = computed<string>(() => {
    const query = this.searchQuery().trim();
    if (!query) return 'Digita il nome di un prodotto (es. Biscotti, Pasta, Pollo)...';
    
    const prod = this.matchedProduct();
    if (!prod) return 'Articolo non trovato nelle sedi';
    
    const locations = this.backendService.getInventoriesForProduct(prod.productId);
    const totalStock = locations.reduce((acc, curr) => acc + curr.stock, 0);

    return totalStock > 0 
      ? `Disponibile nel sistema (${totalStock} unità totali)` 
      : 'Prodotto esaurito in tutte le sedi';
  });

  public readonly locations = computed<StoreAvailabilityResult[]>(() => {
    const prod = this.matchedProduct();
    if (!prod) return [];
    return this.backendService.getInventoriesForProduct(prod.productId);
  });

  public goBack(): void {
    this.router.navigate(['/home']);
  }

  public getAvailabilityColor(availability: number): string {
    if (availability >= 50) return 'text-green';
    if (availability > 0) return 'text-orange';
    return 'text-grey';
  }
}