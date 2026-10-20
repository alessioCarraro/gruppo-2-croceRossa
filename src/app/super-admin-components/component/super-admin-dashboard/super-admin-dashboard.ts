import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

// Interfacce
interface ProductSearchResult {
  id: string;
  name: string;
  category: string;
  stock: number;
}

interface UserProfile {
  name: string;
  role: string;
}

interface MetricCard {
  id: string;
  value: string;
  label: string;
  colorClass: 'blue' | 'green' | 'black' | 'red' | 'orange';
  actionLabel?: string;
}

interface ControlItem {
  id: string;
  iconName: 'clock' | 'users';
  title: string;
  subtitle: string;
  badgeValue: number;
  badgeClass: 'orange' | 'gray';
}

interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'inventory' | 'upload' | 'restock' | 'approve';
  isActive: boolean;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-dashboard.html',
  styleUrls: ['./super-admin-dashboard.css']
})
export class SuperAdminDashboardComponent {
  private readonly router = inject(Router);
  private readonly backendService: MockBackendService = inject(MockBackendService);

  // Numero di approvazioni in attesa (badge sulla voce \"Approva\" della barra in basso)
  readonly pendingApprovals = this.backendService.pendingApprovalCount;

  readonly user = computed<UserProfile>(() => {
    const currentUser = this.backendService.currentOperator();
    return {
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin',
      role: currentUser ? currentUser.role : 'Super Admin'
    };
  });

  // 1. SEDI CON OPZIONE GLOBALE
  readonly locations = computed<string[]>(() => {
    const siteNames = this.backendService.sites().map(site => site.name);
    return ['Tutte le sedi', ...siteNames]; // Aggiungiamo l'opzione per vedere tutto
  });

  // Impostiamo "Tutte le sedi" come predefinita
  readonly selectedLocation = signal<string>('Tutte le sedi');
  readonly isDropdownOpen = signal<boolean>(false);

  // 2. METRICHE FILTRATE PER SEDE
  readonly metrics = computed<MetricCard[]>(() => {
    const products = this.backendService.products();
    let inventories = this.backendService.inventories();

    const currentLocationName = this.selectedLocation();
    const sites = this.backendService.sites();

    if (currentLocationName !== 'Tutte le sedi') {
      const selectedSite = sites.find(s => s.name === currentLocationName);
      if (selectedSite) {
        inventories = inventories.filter(inv => inv.siteId === selectedSite.id);
      }
    }

    let totalValue = 0;
    inventories.forEach(inv => {
      const prod = products.find(p => p.id === inv.productId);
      if (prod) totalValue += inv.stock * prod.price;
    });

    // Conteggio dei prodotti unici presenti
    const catalogCount = products.length;

    // Set di prodotti unici in scadenza (per evitare di contare più volte lo stesso prodotto se ha più lotti)
    const expiringProductIds = new Set<string>();
    let expiredValue = 0;

    inventories.forEach(inv => {
      const prod = products.find(p => p.id === inv.productId);
      if (prod) {
        if (inv.isExpiringSoon) {
          expiringProductIds.add(inv.productId);
        }
        if (inv.isExpired) {
          expiredValue += inv.stock * prod.price;
        }
      }
    });

    const expiringCount = expiringProductIds.size;

    return [
      { id: '1', value: `€${totalValue.toLocaleString('it-IT')}`, label: 'Valore giacenze', colorClass: 'black' },
      { id: '2', value: catalogCount.toString(), label: 'Articoli presenti', colorClass: 'black' },
      { id: '3', value: expiringCount.toString(), label: 'Articoli in scadenza', colorClass: 'orange', actionLabel: 'visualizza articoli' },
      { id: '4', value: `€${expiredValue.toLocaleString('it-IT')}`, label: 'Valore prodotti scaduti', colorClass: 'red' }
    ];
  });

  // 3. CONTROLLI FILTRATI PER SEDE
  readonly controls = computed<ControlItem[]>(() => {
    let ops = this.backendService.operators();
    const currentLocationName = this.selectedLocation();

    // Filtriamo gli operatori in base alla sede scelta
    if (currentLocationName !== 'Tutte le sedi') {
      const sites = this.backendService.sites();
      const selectedSite = sites.find(s => s.name === currentLocationName);
      if (selectedSite) {
        ops = ops.filter(o => o.siteId === selectedSite.id);
      }
    }

    const adminCount = ops.filter(o => o.role === 'Admin').length;
    const volunteerCount = ops.filter(o => o.role === 'User' || o.role === 'Operator').length;

    return [
      { id: '1', iconName: 'users', title: 'Admin delle sedi', subtitle: currentLocationName === 'Tutte le sedi' ? 'referenti totali' : 'referenti in sede', badgeValue: adminCount, badgeClass: 'gray' },
      { id: '2', iconName: 'users', title: 'Volontari delle sedi', subtitle: currentLocationName === 'Tutte le sedi' ? 'volontari totali' : 'volontari in sede', badgeValue: volunteerCount, badgeClass: 'gray' }
    ];
  });

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: true },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornitura', iconName: 'restock', isActive: false },
    { id: 'approve', label: 'Approva', iconName: 'approve', isActive: false }
  ]);

  onLogout(): void {
    this.backendService.logout();
    this.router.navigate(['/login']);
  }

  onProfile(): void {
    this.router.navigate(['/s-admin-profile']);
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

  onMetricAction(metricId: string): void {
    if (metricId === '3') {
      this.router.navigate(['/s-admin-expiring-products']);
    }
  }

  // Testo scritto nella barra di ricerca (nessun reindirizzamento: la ricerca è nella dashboard)
  readonly searchQuery = signal<string>('');

  /**
   * Risultati della ricerca: prodotti del catalogo/magazzino il cui nome contiene il testo scritto.
   * Si aggiornano mentre si scrive; senza testo la lista è vuota.
   */
  readonly searchResults = computed<ProductSearchResult[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    return this.backendService.products()
      .filter(p => p.name.toLowerCase().includes(query))
      .map(p => ({ id: p.id, name: p.name, category: p.category, stock: p.stock }));
  });

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onControlClick(controlId: string): void {
    if (controlId === '1') {
      this.router.navigate(['/s-admin-admin-locations']);
    } else if (controlId === '2') {
      this.router.navigate(['/s-admin-user-locations']);
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(val => !val);
  }

  selectLocation(location: string): void {
    // Quando la sede cambia, this.selectedLocation() notifica in automatico i 'computed'
    this.selectedLocation.set(location);
    this.isDropdownOpen.set(false);
  }
}