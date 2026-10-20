import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface ProductSearchResult { id: string; name: string; stock: number; }

interface UserProfile { name: string; role: string; }
interface MetricCard { id: string; value: string; label: string; colorClass: 'blue' | 'green' | 'black' | 'red'; actionLabel?: string; route?: string; }
interface ControlItem { id: string; iconName: 'clock' | 'users'; title: string; subtitle: string; badgeValue: number; badgeClass: 'orange' | 'gray'; route: string; }
interface NavItem { id: string; label: string; iconName: 'home' | 'inventory' | 'upload' | 'restock'; isActive: boolean; route?: string; }

@Component({
  selector: 'app-user-metro-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-metro-dashboard-component.html',
  styleUrls: ['./user-metro-dashboard-component.css']
})
export class UserMetroDashboardComponent {
  private readonly router = inject(Router);
  private readonly backend = inject(MockBackendService);

  private readonly activeTab = signal<string>('home');
  
  // Nome dell'utente realmente loggato (dalla sessione del MockBackendService)
  readonly user = computed<UserProfile>(() => {
    const operator = this.backend.currentOperator();
    return {
      name: operator ? `${operator.firstName} ${operator.lastName}` : '',
      role: operator?.role ?? ''
    };
  });

  // "computed": la card delle richieste si aggiorna da sola quando cambiano le richieste
  readonly metrics = computed<MetricCard[]>(() => [
    // Numeri reali dalle giacenze della metro (stessa fonte del Super Admin)
    { id: '1', value: this.backend.metroTotalStock().toLocaleString('it-IT'), label: 'Articoli in magazzino', colorClass: 'black' },
    { id: '2', value: this.backend.outgoingShipmentQuantity().toLocaleString('it-IT'), label: 'Articoli in uscita', colorClass: 'black' },
    { id: '3', value: String(this.backend.expiringMetroStock().length), label: 'Articoli in scadenza', colorClass: 'red', actionLabel: 'Visualizza', route: '/user-metro-expiring-products' },
    // Totale reale delle richieste di tutte le sedi (stessa fonte della pagina "Rifornitura sedi")
    { id: '4', value: String(this.backend.totalRestockRequestCount()), label: 'Richieste dalle sedi', colorClass: 'blue', actionLabel: 'Gestisci', route: '/user-metro-restock' }
  ]);

  // Testo scritto nella barra di ricerca
  readonly searchQuery = signal<string>('');

  /**
   * Risultati della ricerca: prodotti presenti nel magazzino della metro il cui nome
   * contiene il testo scritto. Si aggiornano mentre si scrive; senza testo la lista è vuota.
   */
  readonly searchResults = computed<ProductSearchResult[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    // Stessa fonte del Super Admin: giacenze della metro
    return this.backend.metroStock()
      .filter(p => p.name.toLowerCase().includes(query))
      .map(p => ({ id: p.productId, name: p.name, stock: p.stock }));
  });

  public updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  // Conteggio di referenti e volontari dagli operatori del servizio (stessi numeri del Super Admin)
  readonly controls = computed<ControlItem[]>(() => {
    const operators = this.backend.operators();
    const adminCount = operators.filter(o => o.role === 'Admin').length;
    const volunteerCount = operators.filter(o => o.role === 'User' || o.role === 'Operator').length;

    return [
      { id: 'admins', iconName: 'users', title: 'Admin delle sedi', subtitle: 'referenti per sede', badgeValue: adminCount, badgeClass: 'gray', route: '/user-metro-admin-location' },
      { id: 'volunteers', iconName: 'users', title: 'Volontari delle sedi', subtitle: 'volontari in sede', badgeValue: volunteerCount, badgeClass: 'gray', route: '/user-metro-user-location' }
    ];
  });

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: true, route: '/user-metro-dashboard' },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false, route: '/admin-metro-stock' },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false, route: '/admin-metro-load-item' },
    { id: 'restock', label: 'Rifornitura', iconName: 'restock', isActive: false, route: '/admin-metro-restock' } // <-- Modifica: aggiunta la rotta
  ]);

  setTab(tab: string): void {
        this.activeTab.set(tab);
        if (tab === 'home') {
            this.router.navigate(['/user-metro-dashboard']);
        }
        if (tab === 'inventario') {
            this.router.navigate(['/user-metro-stock']);
        }
        if (tab === 'carico') {
            this.router.navigate(['/user-metro-load-item']);
        }
        if (tab === 'rifornitura') {
            this.router.navigate(['/user-metro-restock']);
        }
    }

  public onLogout(): void {
    this.router.navigate(['/login']);
  }

  public onProfile(): void {
    this.router.navigate(['/user-metro-profile']);
  }

  public onMetricClick(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  public onControlClick(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  public onNavClick(clickedItem: NavItem): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === clickedItem.id }))
    );

    if (clickedItem.route) {
      this.router.navigate([clickedItem.route]);
    }
  }
}