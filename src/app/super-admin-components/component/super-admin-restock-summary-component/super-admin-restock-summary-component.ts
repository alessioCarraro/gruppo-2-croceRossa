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

    // 1. AZZERAMENTO RICHIESTE DELLA SEDE (Così il badge del negozio va a 0!)
    const operators = this.backendService.operators();
    const siteOperatorIds = operators
      .filter(o => o.siteId === this.currentSiteId)
      .map(o => o.id);

    const currentApprovals = this.backendService.approvals();
    const shippedApprovalIds = itemsToShip.map(i => i.approvalId).filter(Boolean);

    // Rimuoviamo le richieste di Riordino di questa sede in quanto il rifornimento per il negozio è stato soddisfatto
    const remainingApprovals = currentApprovals.filter(app => {
      // Se l'ID è stato esplicitamente evaso nel carrello, lo rimuoviamo
      if (shippedApprovalIds.includes(app.id)) return false;
      // Inoltre, se è una richiesta di 'Riordino' di questo negozio, la consideriamo soddisfatta con questo ordine
      if (app.type === 'Riordino' && siteOperatorIds.includes(app.requestedBy)) {
        return false;
      }
      return true;
    });

    // Salviamo in localStorage e aggiorniamo qualunque signal (pubblico o privato) dentro MockBackendService
    localStorage.setItem('cri_approvals', JSON.stringify(remainingApprovals));
    for (const key of Object.keys(serviceAny)) {
      const prop = serviceAny[key];
      if (typeof prop === 'function' && typeof prop.set === 'function') {
        try {
          const val = prop();
          if (Array.isArray(val) && val.some((x: any) => x && x.requestedBy !== undefined && x.type !== undefined)) {
            prop.set(remainingApprovals);
          }
        } catch {}
      }
    }

    // 2. SCALATURA REALE DELLE QUANTITÀ DA METRO
    const savedMetroStockRaw = localStorage.getItem('cri_metro_custom_stock');
    const savedMetroStock: Record<string, number> = savedMetroStockRaw ? JSON.parse(savedMetroStockRaw) : {};

    for (const item of itemsToShip) {
      const currentQty = savedMetroStock[item.productId] !== undefined ? savedMetroStock[item.productId] : 350;
      savedMetroStock[item.productId] = Math.max(0, currentQty - item.quantity);
    }
    localStorage.setItem('cri_metro_custom_stock', JSON.stringify(savedMetroStock));

    // Aggiorniamo anche eventuali lotti nell'inventario di MockBackendService
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

    // 3. Puliamo il carrello della sede e torniamo alla lista sedi
    sessionStorage.removeItem(this.getCartStorageKey(this.currentSiteId));
    this.router.navigate(['/s-admin-restock']);
  }
}