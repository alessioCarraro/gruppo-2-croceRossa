import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackendService } from '../../../utils';

@Component({
  selector: 'app-super-admin-add-existing-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-add-existing-item.html',
  styleUrls: ['./super-admin-add-existing-item.css']
})
export class SuperAdminAddExistingItemComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly backendService = inject(MockBackendService);

  public macroCategory = signal<string>('Alimentari');
  
  // Valori selezionati
  public selectedCategory = signal<string>('');
  public selectedProductId = signal<string>('');
  public expiryDate = signal<string>('');
  public quantity = signal<string>('0');

  // Stati di apertura tendine personalizzate
  public isCategoryOpen = signal<boolean>(false);
  public isProductOpen = signal<boolean>(false);

  // Categorie dal service
  public availableCategories = computed<string[]>(() => {
    const products = this.backendService.products();
    const uniqueCats = new Set(products.map(p => p.category));
    return Array.from(uniqueCats);
  });

  // Prodotti filtrati in base alla categoria scelta
  public filteredProducts = computed(() => {
    const category = this.selectedCategory();
    if (!category) return [];
    return this.backendService.products().filter(p => p.category === category);
  });

  // Nome del prodotto attualmente selezionato (per mostrarlo nel box)
  public selectedProductName = computed<string>(() => {
    const prodId = this.selectedProductId();
    if (!prodId) return '';
    const prod = this.backendService.getProduct(prodId);
    return prod ? `${prod.name} (${prod.unit})` : '';
  });

  // Giacenza attuale del prodotto selezionato
  public currentStock = computed<number>(() => {
    const prodId = this.selectedProductId();
    if (!prodId) return 0;
    const product = this.backendService.getProduct(prodId);
    return product ? product.stock : 0;
  });

  public isFormValid = computed<boolean>(() => {
    return this.selectedProductId() !== '' && 
           this.expiryDate() !== '' && 
           parseInt(this.quantity(), 10) > 0;
  });

  ngOnInit(): void {
    const productIdFromUrl = this.route.snapshot.queryParamMap.get('id');
    if (productIdFromUrl) {
      const product = this.backendService.getProduct(productIdFromUrl);
      if (product) {
        this.selectedCategory.set(product.category);
        this.selectedProductId.set(product.id);
      }
    }
  }

  // Toggle apertura tendine
  public toggleCategoryDropdown(): void {
    this.isCategoryOpen.update(v => !v);
    this.isProductOpen.set(false);
  }

  public toggleProductDropdown(): void {
    if (!this.selectedCategory()) return;
    this.isProductOpen.update(v => !v);
    this.isCategoryOpen.set(false);
  }

  // Selezione voce
  public chooseCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.selectedProductId.set('');
    this.isCategoryOpen.set(false);
  }

  public chooseProduct(productId: string): void {
    this.selectedProductId.set(productId);
    this.isProductOpen.set(false);
  }

  public updateExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.expiryDate.set(input.value);
  }

  public updateQuantity(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantity.set(input.value);
  }

  public goBack(): void {
    this.router.navigate(['/s-admin-load-item']);
  }

  public saveLoad(): void {
    if (!this.isFormValid()) return;

    const qty = parseInt(this.quantity(), 10);
    this.backendService.addStockToInventory(
      this.selectedProductId(), 
      qty, 
      this.expiryDate()
    );

    this.router.navigate(['/s-admin-metro-stock']);
  }
}