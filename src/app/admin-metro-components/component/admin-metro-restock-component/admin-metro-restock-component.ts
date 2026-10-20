import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface OfficeLocation {
  id: string;
  name: string;
  requests: number;
}

interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'inventory' | 'upload' | 'restock';
  isActive: boolean;
  route?: string;
}

@Component({
  selector: 'app-admin-metro-restock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-restock-component.html',
  styleUrls: ['./admin-metro-restock-component.css']
})
export class AdminMetroRestockComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly backend = inject(MockBackendService);

  /**
   * Sedi da rifornire. Il numero di richieste arriva dal servizio, con lo stesso
   * calcolo usato dalla pagina della singola sede: si aggiorna da solo (0 se non ce ne sono).
   */
  public readonly locations = computed<OfficeLocation[]>(() =>
    this.backend.distributionSites().map(site => ({
      id: site.id,
      name: site.name,
      requests: this.backend.restockRequestCount(site.id)
    }))
  );

  public readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false, route: '/user-metro-dashboard' },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false, route: '/admin-metro-stock' },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false, route: '/admin-metro-load-item' },
    { id: 'restock', label: 'Rifornitura', iconName: 'restock', isActive: true, route: '/admin-metro-restock' }
  ]);

  public goBack(): void {
    this.location.back();
  }

  public selectLocation(office: OfficeLocation): void {
    // Passa la sede scelta alla pagina di destinazione (?siteId=...)
    this.router.navigate(['/user-metro-restock-single-store'], { queryParams: { siteId: office.id } });
  }

  public changeTab(clickedItem: NavItem): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === clickedItem.id }))
    );

    if (clickedItem.route) {
      this.router.navigate([clickedItem.route]);
    }
  }
}