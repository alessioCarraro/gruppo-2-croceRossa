import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface LocationRequest {
  id: string;
  name: string;
  requests: number;
}

interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'inventory' | 'upload' | 'restock' | 'approve';
  isActive: boolean;
}

@Component({
  selector: 'app-super-admin-restock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-restoock-component.html',
  styleUrls: ['./super-admin-restoock-component.css']
})
export class SuperAdminRestoockComponent {
  private readonly router = inject(Router);
  private readonly backendService = inject(MockBackendService);

  // Numero di approvazioni in attesa (badge sulla voce \"Approva\" della barra in basso)
  readonly pendingApprovals = this.backendService.pendingApprovalCount;

  public searchQuery = signal<string>('');

  // Sedi con il numero di richieste: stessa fonte e stesso calcolo dell'Operator
  // (restockRequestCount), quindi il numero scende quando una richiesta va nel carrello o viene inviata
  readonly locations = computed<LocationRequest[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();

    const mappedLocations = this.backendService.distributionSites().map(site => ({
      id: site.id,
      name: site.name,
      requests: this.backendService.restockRequestCount(site.id)
    }));

    if (!query) return mappedLocations;
    return mappedLocations.filter(loc => loc.name.toLowerCase().includes(query));
  });

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornitura', iconName: 'restock', isActive: true },
    { id: 'approve', label: 'Approva', iconName: 'approve', isActive: false }
  ]);

  public updateSearchQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }

  selectLocation(loc: LocationRequest): void {
    // Apre la pagina della sede passando l'id
    this.router.navigate(['/s-admin-restock-single-store'], { queryParams: { siteId: loc.id } });
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
    switch (navId) {
      case 'home': this.router.navigate(['/s-admin-home']); break;
      case 'inventory': this.router.navigate(['/s-admin-metro-stock']); break;
      case 'upload': this.router.navigate(['/s-admin-load-item']); break;
      case 'restock': this.router.navigate(['/s-admin-restock']); break;
      case 'approve': this.router.navigate(['/s-admin-approval-requests']); break;
    }
  }
}