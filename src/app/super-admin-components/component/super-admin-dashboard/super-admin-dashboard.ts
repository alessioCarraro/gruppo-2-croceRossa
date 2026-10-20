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
  route?: string; // pagina aperta dal link della card
  queryParams?: Record<string, string>; // parametri passati alla pagina (es. la sede selezionata)
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

  // Sede selezionata (null = "Tutte le sedi")
  private readonly selectedSiteId = computed<string | null>(() => {
    const name = this.selectedLocation();
    if (name === 'Tutte le sedi') return null;
    return this.backendService.sites().find(s => s.name === name)?.id ?? null;
  });

  // 2. METRICHE FILTRATE PER SEDE
  // Tutti i valori arrivano da MockBackendService.siteStats(): la stessa funzione usata dall'Operator.
  // Con "Tutte le sedi" sono i totali; con una sede sono solo i valori di quella sede (0 se non ha dati).
  // Il computed si ricalcola da solo quando cambia la sede o cambiano i dati condivisi.
  readonly metrics = computed<MetricCard[]>(() => {
    const stats = this.backendService.siteStats(this.selectedSiteId());
    const euro = (value: number) => `€${value.toLocaleString('it-IT')}`;

    // La pagina delle scadenze mostra la stessa sede selezionata qui
    const siteId = this.selectedSiteId();
    const siteParams = siteId ? { siteId } : undefined;

    // Ordine: 3 righe da 2 card
    return [
      // Riga 1
      { id: 'stock-value', value: euro(stats.stockValue), label: 'Valore giacenze', colorClass: 'black' },
      { id: 'expired-value', value: euro(stats.expiredValue), label: 'Valore prodotti scaduti', colorClass: 'red' },
      // Riga 2
      { id: 'total-items', value: stats.totalItems.toLocaleString('it-IT'), label: 'Articoli in magazzino', colorClass: 'black' },
      { id: 'outgoing-items', value: stats.outgoingItems.toLocaleString('it-IT'), label: 'Articoli in uscita', colorClass: 'black' },
      // Riga 3
      { id: 'expiring-items', value: stats.expiringItems.toString(), label: 'Articoli in scadenza', colorClass: 'orange', actionLabel: 'visualizza articoli', route: '/s-admin-expiring-products', queryParams: siteParams },
      { id: 'requests', value: stats.requestCount.toString(), label: 'Richieste dalle sedi', colorClass: 'blue', actionLabel: 'gestisci', route: '/s-admin-restock' }
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

  // Apre la pagina collegata alla card (se c'è)
  onMetricAction(route?: string, queryParams?: Record<string, string>): void {
    if (route) {
      this.router.navigate([route], { queryParams });
    }
  }

  // Testo scritto nella barra di ricerca (nessun reindirizzamento: la ricerca è nella dashboard)
  readonly searchQuery = signal<string>('');

  /**
   * Risultati della ricerca: prodotti della metro il cui nome contiene il testo scritto
   * (stessa fonte dell'Operator). Si aggiornano mentre si scrive; senza testo la lista è vuota.
   */
  readonly searchResults = computed<ProductSearchResult[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    return this.backendService.metroStock()
      .filter(p => p.name.toLowerCase().includes(query))
      .map(p => ({ id: p.productId, name: p.name, category: p.category, stock: p.stock }));
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