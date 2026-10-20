import { Component, computed, inject, signal } from '@angular/core';
import { MockBackendService } from '../../../utils';
import { Router } from '@angular/router';

interface UserData { initials: string; name: string; }
interface InfoItem { id: string; label: string; value: string; isMonospace?: boolean; }
interface NavItem { id: string; label: string; iconName: 'home' | 'inventory' | 'upload' | 'profile'; isActive: boolean; }

@Component({
  imports: [],
  selector: 'app-profile-component',
  styleUrl: './profile-component.css',
  templateUrl: './profile-component.html',
})
export class ProfileComponent {
  // Sessione di login: contiene l'utente che ha effettuato l'accesso
  private readonly backend = inject(MockBackendService);
  private readonly router = inject(Router);

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
    this.router.navigate(['/admin-home']);
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
