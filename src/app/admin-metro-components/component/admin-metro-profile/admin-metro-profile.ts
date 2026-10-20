import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MockBackendService } from '../../../utils';

// ... (Interfacce invariate)
interface UserData { initials: string; name: string; }
interface InfoItem { id: string; label: string; value: string; isMonospace?: boolean; }
interface NavItem { id: string; label: string; iconName: 'home' | 'inventory' | 'upload' | 'profile'; isActive: boolean; }

@Component({
  selector: 'app-admin-metro-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-profile.html',
  styleUrls: ['./admin-metro-profile.css']
})
export class AdminMetroProfileComponent {
  // Uso del servizio Location per gestire il pulsante "Indietro" nativo
  private readonly location = inject(Location);
  // Sessione di login: contiene l'utente che ha effettuato l'accesso
  private readonly backend = inject(MockBackendService);

  // Dati dell'utente realmente loggato (nessun dato di esempio)
  readonly user = computed<UserData>(() => {
    const operator = this.backend.currentOperator();
    if (!operator) return { initials: '?', name: '' };

    return {
      initials: `${operator.firstName.charAt(0)}${operator.lastName.charAt(0)}`.toUpperCase(),
      name: `${operator.firstName} ${operator.lastName}`
    };
  });

  readonly infoItems = computed<InfoItem[]>(() => {
    const operator = this.backend.currentOperator();
    return [
      { id: 'role', label: 'Ruolo', value: operator?.role ?? '-' },
      { id: 'location', label: 'Sede', value: this.backend.currentSite()?.name ?? '-' },
      { id: 'email', label: 'Email', value: operator?.email ?? '-', isMonospace: true }
    ];
  });

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'profile', label: 'Profilo', iconName: 'profile', isActive: true }
  ]);

  goBack(): void {
    // Riporta l'utente all'ultima pagina visitata mantenendo la cronologia
    this.location.back();
  }

  onEditProfile(): void {
    console.log('Azione: Modifica dati profilo');
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
  }
}