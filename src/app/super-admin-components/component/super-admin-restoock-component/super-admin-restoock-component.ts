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

  public searchQuery = signal<string>('');

  // Carica le sedi dal MockBackendService calcolando le richieste di riordino associate
  readonly locations = computed<LocationRequest[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    const sites = this.backendService.sites().filter(s => s.type !== 'Metro');
    const approvals = this.backendService.approvals();
    const operators = this.backendService.operators();

    // Leggiamo le richieste evase specificamente per singola sede (formato: "siteId_approvalId")
    const completedRaw = localStorage.getItem('cri_completed_restocks');
    const completedKeys: string[] = completedRaw ? JSON.parse(completedRaw) : [];

    const mappedLocations = sites.map(site => {
      const siteOperatorsIds = operators.filter(o => o.siteId === site.id).map(o => o.id);
      
      const requestsCount = approvals.filter(a => 
        a.type === 'Riordino' && 
        a.status !== 'Rifiutata' && 
        siteOperatorsIds.includes(a.requestedBy) &&
        !completedKeys.includes(`${site.id}_${a.id}`)
      ).length;

      return {
        id: site.id,
        name: site.name,
        requests: requestsCount
      };
    });

    if (!query) return mappedLocations;
    return mappedLocations.filter(loc => loc.name.toLowerCase().includes(query));
  });

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornit.', iconName: 'restock', isActive: true },
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
    // Naviga alla pagina di preparazione pacco passandogli l'id della sede
    // (Se non hai ancora una rotta specifica per preparare la spedizione, puoi modificare questo percorso in seguito)
    console.log(`Prepara spedizione per: ${loc.name}`);
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