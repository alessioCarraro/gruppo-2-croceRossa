import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { RestockCartItem } from '../super-admin-restock-single-store-component/super-admin-restock-single-store-component';

@Component({
  selector: 'app-super-admin-restock-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-restock-summary-component.html',
  styleUrls: ['./super-admin-restock-summary-component.css']
})
export class SuperAdminRestockSummary implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly backendService = inject(MockBackendService);

  private currentSiteId: string | null = null;
  public locationLabel = signal<string>('Sede');
  public orderItems = signal<RestockCartItem[]>([]);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const siteId = params['siteId'];
      if (siteId) {
        this.currentSiteId = siteId;
        this.loadSummaryData(siteId);
      }
    });
  }

  private getCartStorageKey(siteId: string): string {
    return `cri_restock_cart_${siteId}`;
  }

  private loadSummaryData(siteId: string): void {
    const site = this.backendService.sites().find(s => s.id === siteId);
    if (site) {
      this.locationLabel.set(site.name);
    }

    const raw = sessionStorage.getItem(this.getCartStorageKey(siteId));
    if (raw) {
      try {
        this.orderItems.set(JSON.parse(raw));
      } catch {
        this.orderItems.set([]);
      }
    }
  }

  public goBack(): void {
    if (this.currentSiteId) {
      this.router.navigate(['/s-admin-restock-single-store'], {
        queryParams: { siteId: this.currentSiteId }
      });
    } else {
      this.router.navigate(['/s-admin-restock']);
    }
  }

  public removeItem(itemId: string): void {
    this.orderItems.update(items => items.filter(item => item.id !== itemId));
    if (this.currentSiteId) {
      sessionStorage.setItem(
        this.getCartStorageKey(this.currentSiteId),
        JSON.stringify(this.orderItems())
      );
    }
  }

  public async submitOrder(): Promise<void> {
    if (this.orderItems().length === 0 || !this.currentSiteId) return;

    const itemsToShip = this.orderItems();
    const serviceAny = this.backendService as any;

    // 1. SEGNIAMO COME EVASE SOLO LE SPECIFICHE RICHIESTE PRESENTI NEL CARRELLO (tramite approvalId)
    const completedRaw = localStorage.getItem('cri_completed_restocks');
    const completedKeys: string[] = completedRaw ? JSON.parse(completedRaw) : [];

    for (const item of itemsToShip) {
      if (item.approvalId) {
        const key = `${this.currentSiteId}_${item.approvalId}`;
        if (!completedKeys.includes(key)) {
          completedKeys.push(key);
        }
      }
    }
    localStorage.setItem('cri_completed_restocks', JSON.stringify(completedKeys));

    // 2. SCALATURA REALE DELLE QUANTITÀ DA METRO
    const savedMetroStockRaw = localStorage.getItem('cri_metro_custom_stock');
    const savedMetroStock: Record<string, number> = savedMetroStockRaw ? JSON.parse(savedMetroStockRaw) : {};

    for (const item of itemsToShip) {
      const currentQty = savedMetroStock[item.productId] !== undefined ? savedMetroStock[item.productId] : 350;
      savedMetroStock[item.productId] = Math.max(0, currentQty - item.quantity);
    }
    localStorage.setItem('cri_metro_custom_stock', JSON.stringify(savedMetroStock));

    // Scalatura per i lotti interni
    const metroSite = this.backendService.sites().find(s => s.type === 'Metro') || this.backendService.sites()[0];
    for (const key of Object.keys(serviceAny)) {
      const prop = serviceAny[key];
      if (typeof prop === 'function' && typeof prop.set === 'function') {
        try {
          const val = prop();
          if (Array.isArray(val) && val.some((x: any) => x && x.productId !== undefined && x.siteId !== undefined)) {
            const updatedInv = val.map((lot: any) => ({ ...lot }));
            for (const item of itemsToShip) {
              let rem = item.quantity;
              for (const lot of updatedInv) {
                if (lot.productId === item.productId && lot.siteId === metroSite.id && rem > 0) {
                  const take = Math.min(lot.quantity, rem);
                  lot.quantity -= take;
                  rem -= take;
                }
              }
            }
            prop.set(updatedInv);
            localStorage.setItem('cri_inventory', JSON.stringify(updatedInv));
            localStorage.setItem('cri_batches', JSON.stringify(updatedInv));
          }
        } catch {}
      }
    }

    // 3. Svuotamento carrello della sede e ritorno alla lista
    sessionStorage.removeItem(this.getCartStorageKey(this.currentSiteId));
    this.router.navigate(['/s-admin-restock']);
  }
}