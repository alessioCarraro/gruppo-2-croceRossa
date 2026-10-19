import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface BaseProduct {
  id: string;
  productId: string;
  name: string;
  category: string;
  stockMagazzino: number;
  stockSede: number;
  requestedQty: number;
  isAvailable: boolean;
}

interface ProductRequest extends BaseProduct {
  approvalId: string;
  expiryDate?: string;
}

interface CatalogItem extends BaseProduct {
  expiryDate: string;
  isExpiringSoon: boolean;
}

export interface RestockCartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  approvalId?: string;
}

@Component({
  selector: 'app-super-admin-restock-single-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-restock-single-store-component.html',
  styleUrls: ['./super-admin-restock-single-store-component.css']
})
export class SuperAdminRestockSingleStoreComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly backendService = inject(MockBackendService);

  private currentSiteId: string | null = null;
  public siteName = signal<string>('Nome sede');
  public searchQuery = signal<string>('');

  public cartItems = signal<RestockCartItem[]>([]);
  public cartCount = computed<number>(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  public activeCategory = signal<string>('Tutti');
  public categories = signal<string[]>(['Tutti']);

  public storeRequests = signal<ProductRequest[]>([]);
  public storeCatalog = signal<CatalogItem[]>([]);

  readonly filteredRequests = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();
    return this.storeRequests().filter(r => {
      const matchQuery = !q || r.name.toLowerCase().includes(q);
      const matchCat = cat === 'Tutti' || r.category === cat;
      return matchQuery && matchCat;
    });
  });

  readonly filteredCatalog = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();
    return this.storeCatalog().filter(c => {
      const matchQuery = !q || c.name.toLowerCase().includes(q);
      const matchCat = cat === 'Tutti' || c.category === cat;
      return matchQuery && matchCat;
    });
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const siteId = params['siteId'];
      if (siteId) {
        this.currentSiteId = siteId;
        this.loadSavedCart(siteId);
        this.loadStoreData(siteId);
      }
    });
  }

  private getCartStorageKey(siteId: string): string {
    return `cri_restock_cart_${siteId}`;
  }

  private loadSavedCart(siteId: string): void {
    const raw = sessionStorage.getItem(this.getCartStorageKey(siteId));
    if (raw) {
      try {
        this.cartItems.set(JSON.parse(raw));
      } catch {
        this.cartItems.set([]);
      }
    }
  }

  private saveCart(): void {
    if (!this.currentSiteId) return;
    sessionStorage.setItem(this.getCartStorageKey(this.currentSiteId), JSON.stringify(this.cartItems()));
  }

  private loadStoreData(siteId: string): void {
    const sites = this.backendService.sites();
    const currentSite = sites.find(s => s.id === siteId);
    const metroSite = sites.find(s => s.type === 'Metro') || sites[0];

    if (currentSite) {
      this.siteName.set(currentSite.name);
    }

    const products = this.backendService.products();
    const inventory = (this.backendService as any).inventory ? (this.backendService as any).inventory() : [];
    const approvals = this.backendService.approvals();
    const operators = this.backendService.operators();

    const uniqueCats = Array.from(new Set(products.map(p => p.category)));
    this.categories.set(['Tutti', ...uniqueCats]);

    const getStockInfo = (prodId: string, targetSiteId: string) => {
      const items = inventory.filter((i: any) => i.productId === prodId && i.siteId === targetSiteId);
      const totalQty = items.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);
      const earliestExpiry = items.length > 0 && items[0].expiryDate ? items[0].expiryDate : null;
      return { totalQty, earliestExpiry };
    };

    const existingApprovalIdsInCart = this.cartItems().map(c => c.approvalId).filter(Boolean);

    // 1. Richieste della sede (escludendo quelle già messe nel carrello)
    const siteOperatorIds = operators.filter(o => o.siteId === siteId).map(o => o.id);
    const siteApprovals = approvals.filter(a =>
      a.type === 'Riordino' &&
      (a.status === 'In attesa' || a.status === 'Approvata') &&
      siteOperatorIds.includes(a.requestedBy) &&
      !existingApprovalIdsInCart.includes(a.id)
    );

    const mappedRequests: ProductRequest[] = siteApprovals.map(app => {
      const prod = products.find(p => p.id === app.productId);
      const metroStock = getStockInfo(app.productId || '', metroSite.id);
      const sedeStock = getStockInfo(app.productId || '', siteId);

      const availableMetro = metroStock.totalQty > 0 ? metroStock.totalQty : 500;
      const expDate = metroStock.earliestExpiry
        ? new Date(metroStock.earliestExpiry).toLocaleDateString('it-IT')
        : '15/12/2026';

      return {
        id: `req_${app.id}`,
        approvalId: app.id,
        productId: prod ? prod.id : '',
        name: prod ? prod.name : app.description,
        category: prod ? prod.category : 'Alimentari',
        stockMagazzino: availableMetro,
        stockSede: sedeStock.totalQty,
        expiryDate: expDate,
        requestedQty: app.quantity || 1,
        isAvailable: availableMetro > 0
      };
    });
    this.storeRequests.set(mappedRequests);

    // 2. Catalogo magazzino
    const now = new Date();
    const mappedCatalog: CatalogItem[] = products.map(prod => {
      const metroStock = getStockInfo(prod.id, metroSite.id);
      const sedeStock = getStockInfo(prod.id, siteId);

      const alreadyInCartQty = this.cartItems()
        .filter(c => c.productId === prod.id)
        .reduce((sum, c) => sum + c.quantity, 0);

      const baseMetro = metroStock.totalQty > 0 ? metroStock.totalQty : 350;
      const availableMetro = Math.max(0, baseMetro - alreadyInCartQty);
      const rawExp = metroStock.earliestExpiry ? new Date(metroStock.earliestExpiry) : new Date(2026, 11, 31);
      const diffDays = (rawExp.getTime() - now.getTime()) / (1000 * 3600 * 24);

      return {
        id: `cat_${prod.id}`,
        productId: prod.id,
        name: prod.name,
        category: prod.category,
        stockMagazzino: availableMetro,
        stockSede: sedeStock.totalQty,
        expiryDate: rawExp.toLocaleDateString('it-IT'),
        isExpiringSoon: diffDays <= 30,
        requestedQty: 0,
        isAvailable: availableMetro > 0
      };
    });
    this.storeCatalog.set(mappedCatalog);
  }

  public updateSearchQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  public goBack(): void {
    this.router.navigate(['/s-admin-restock']);
  }

  public selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  public updateRequestQuantity(itemId: string, delta: number): void {
    this.storeRequests.update(reqs =>
      reqs.map(req => {
        if (req.id === itemId && req.isAvailable) {
          return { ...req, requestedQty: Math.max(0, Math.min(req.stockMagazzino, req.requestedQty + delta)) };
        }
        return req;
      })
    );
  }

  public addRequestToCart(item: ProductRequest): void {
    if (item.isAvailable && item.requestedQty > 0) {
      this.mergeIntoCart({
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: item.productId,
        name: item.name,
        quantity: item.requestedQty,
        approvalId: item.approvalId
      });

      this.storeRequests.update(reqs => reqs.filter(r => r.id !== item.id));
    }
  }

  public updateCatalogQuantity(itemId: string, delta: number): void {
    this.storeCatalog.update(cats =>
      cats.map(cat => {
        if (cat.id === itemId && cat.isAvailable) {
          return { ...cat, requestedQty: Math.max(0, Math.min(cat.stockMagazzino, cat.requestedQty + delta)) };
        }
        return cat;
      })
    );
  }

  public addCatalogToCart(item: CatalogItem): void {
    if (item.isAvailable && item.requestedQty > 0) {
      this.mergeIntoCart({
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: item.productId,
        name: item.name,
        quantity: item.requestedQty
      });

      this.storeCatalog.update(cats =>
        cats.map(cat => cat.id === item.id
          ? { ...cat, requestedQty: 0, stockMagazzino: Math.max(0, cat.stockMagazzino - item.requestedQty) }
          : cat
        )
      );
    }
  }

  private mergeIntoCart(newItem: RestockCartItem): void {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(
        i => i.productId === newItem.productId && i.approvalId === newItem.approvalId
      );
      if (existingIndex > -1) {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity
        };
        return updated;
      }
      return [...items, newItem];
    });
    this.saveCart();
  }

  // Naviga alla pagina di riepilogo ordine passando il siteId
  public reviewOrder(): void {
    if (!this.currentSiteId) return;
    this.saveCart();
    this.router.navigate(['/s-admin-restock-summary'], {
      queryParams: { siteId: this.currentSiteId }
    });
  }
}