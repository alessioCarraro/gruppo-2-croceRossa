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

    // 1. Gestione delle richieste approvate/evase
    const approvals = this.backendService.approvals();
    const updatedApprovals = approvals.map(app => {
      const matchedCartItem = itemsToShip.find(ci => ci.approvalId === app.id);
      if (matchedCartItem) {
        return { ...app, status: 'Evasa' };
      }
      return app;
    });

    if (typeof serviceAny.updateApprovals === 'function') {
      serviceAny.updateApprovals(updatedApprovals);
    } else if (serviceAny.approvals && typeof serviceAny.approvals.set === 'function') {
      serviceAny.approvals.set(updatedApprovals);
      localStorage.setItem('cri_approvals', JSON.stringify(updatedApprovals));
    }

    // 2. Scaliamo fisicamente le quantità dall'inventario del magazzino Metro
    const inventory = serviceAny.inventory ? serviceAny.inventory() : [];
    const metroSite = serviceAny.sites().find((s: any) => s.type === 'Metro') || serviceAny.sites()[0];

    const updatedInventory = [...inventory];

    for (const item of itemsToShip) {
      const metroLots = updatedInventory.filter(
        (inv: any) => inv.productId === item.productId && inv.siteId === metroSite.id
      );

      let remainingToSubtract = item.quantity;

      for (const lot of metroLots) {
        if (remainingToSubtract <= 0) break;

        if (lot.quantity >= remainingToSubtract) {
          lot.quantity -= remainingToSubtract;
          remainingToSubtract = 0;
        } else {
          remainingToSubtract -= lot.quantity;
          lot.quantity = 0;
        }
      }

      const destLot = updatedInventory.find(
        (inv: any) => inv.productId === item.productId && inv.siteId === this.currentSiteId
      );

      if (destLot) {
        destLot.quantity += item.quantity;
      } else {
        updatedInventory.push({
          id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          productId: item.productId,
          siteId: this.currentSiteId,
          quantity: item.quantity,
          expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    if (typeof serviceAny.updateInventory === 'function') {
      serviceAny.updateInventory(updatedInventory);
    } else if (serviceAny.inventory && typeof serviceAny.inventory.set === 'function') {
      serviceAny.inventory.set(updatedInventory);
      localStorage.setItem('cri_inventory', JSON.stringify(updatedInventory));
    }

    // 3. Svuotiamo il carrello temporaneo e torniamo alla lista delle sedi
    sessionStorage.removeItem(this.getCartStorageKey(this.currentSiteId));
    this.router.navigate(['/s-admin-restock']);
  }
}