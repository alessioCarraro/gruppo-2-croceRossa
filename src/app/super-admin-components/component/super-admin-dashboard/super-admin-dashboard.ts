import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Assicurati che il percorso dell'import sia corretto rispetto a dove si trova il tuo file utils.ts
import { MockBackendService } from '../../../utils';

// Interfacce per il Single Responsibility Principle e Strict Typing
interface UserProfile {
  name: string;
  role: string;
}

interface MetricCard {
  id: string;
  value: string;
  label: string;
  colorClass: 'blue' | 'green' | 'black' | 'red'| 'orange';
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
  private readonly backendService = inject(MockBackendService); // Iniettiamo il service

  // 1. DATI UTENTE DINAMICI
  readonly user = computed<UserProfile>(() => {
    const currentUser = this.backendService.currentOperator();
    return {
      // Se c'è un utente loggato mostra "Nome Cognome", altrimenti un fallback
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin',
      role: currentUser ? currentUser.role : 'Super Admin'
    };
  });

  // 2. SEDI DINAMICHE
  readonly locations = computed<string[]>(() => {
    // Estrae i nomi di tutte le sedi presenti in utils.ts
    return this.backendService.sites().map(site => site.name);
  });
  
  // Impostiamo la sede di default come fissa o basata sul primo elemento
  readonly selectedLocation = signal<string>('Metro Milano');
  readonly isDropdownOpen = signal<boolean>(false);

  // 3. METRICHE DINAMICHE (Calcolate dai prodotti e dall'inventario)
  readonly metrics = computed<MetricCard[]>(() => {
    const products = this.backendService.products();
    const inventories = this.backendService.inventories();

    // Calcolo valore totale giacenze
    let totalValue = 0;
    inventories.forEach(inv => {
      const prod = products.find(p => p.id === inv.productId);
      if (prod) totalValue += inv.stock * prod.price;
    });

    // Articoli a catalogo
    const catalogCount = products.length;

    // Articoli in scadenza
    const expiringCount = products.filter(p => p.isExpiringSoon).length;

    // Valore prodotti scaduti
    let expiredValue = 0;
    inventories.filter(inv => inv.isExpired).forEach(inv => {
      const prod = products.find(p => p.id === inv.productId);
      if (prod) expiredValue += inv.stock * prod.price;
    });

    return [
      { id: '1', value: `€${totalValue.toLocaleString('it-IT')}`, label: 'Valore giacenze totale', colorClass: 'black' },
      { id: '2', value: catalogCount.toString(), label: 'Articoli a catalogo', colorClass: 'black' },
      { id: '3', value: expiringCount.toString(), label: 'Articoli in scadenza (entro 30 giorni)', colorClass: 'orange', actionLabel: 'visualizza articoli' },
      { id: '4', value: `€${expiredValue.toLocaleString('it-IT')}`, label: 'Valore prodotti scaduti (ultimi 30 giorni)', colorClass: 'red' }
    ];
  });

  // 4. CONTROLLI DINAMICI (Calcolati dagli operatori)
  readonly controls = computed<ControlItem[]>(() => {
    const ops = this.backendService.operators();
    // Conta quanti operatori hanno ruolo 'Admin'
    const adminCount = ops.filter(o => o.role === 'Admin').length;
    // Conta quanti operatori hanno ruolo 'User' o 'Operator' (considerandoli volontari/operatori)
    const volunteerCount = ops.filter(o => o.role === 'User' || o.role === 'Operator').length;

    return [
      { id: '1', iconName: 'users', title: 'Admin delle sedi', subtitle: 'referenti per sede', badgeValue: adminCount, badgeClass: 'gray' },
      { id: '2', iconName: 'users', title: 'Volontari delle sedi', subtitle: 'volontari in sede', badgeValue: volunteerCount, badgeClass: 'gray' }
    ];
  });

  // Voci "Bottom Navigation" (Rimangono statiche perché definiscono l'UI)
  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: true },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornit.', iconName: 'restock', isActive: false },
    { id: 'approve', label: 'Approva', iconName: 'approve', isActive: false }
  ]);

  // Azioni Header
  onLogout(): void {
    this.backendService.logout(); // Esegue il logout effettivo ripulendo i dati di sessione
    this.router.navigate(['/login']);
  }

  onProfile(): void {
    this.router.navigate(['/s-admin-profile']);
  }

  // Azione click navigazione inferiore
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

  // Azione per le metriche (es: articoli in scadenza)
  onMetricAction(metricId: string): void {
    if (metricId === '3') {
      this.router.navigate(['/s-admin-expiring-products']);
    }
  }

  // Azione al click sulla barra di ricerca
  goToInventorySearch(): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === 'inventory' }))
    );
    this.router.navigate(['/s-admin-metro-stock']);
  }

  // Azione al click sulle card dei Controlli (Admin e Volontari)
  onControlClick(controlId: string): void {
    if (controlId === '1') {
      this.router.navigate(['/s-admin-admin-locations']);
    } else if (controlId === '2') {
      this.router.navigate(['/s-admin-user-locations']);
    }
  }

  // Azioni Dropdown
  toggleDropdown(): void {
    this.isDropdownOpen.update(val => !val);
  }

  selectLocation(location: string): void {
    this.selectedLocation.set(location);
    this.isDropdownOpen.set(false);
  }
}