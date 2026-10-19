import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface UserData {
  initials: string;
  name: string;
}

interface InfoItem {
  id: string;
  label: string;
  value: string;
  isMonospace?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'inventory' | 'upload' | 'profile';
  isActive: boolean;
}

@Component({
  selector: 'app-super-admin-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-profile-component.html',
  styleUrls: ['./super-admin-profile-component.css']
})
export class SuperAdminProfileComponent {
  private readonly router = inject(Router);
  private readonly backendService = inject(MockBackendService);

  // Gestione dinamica dello stato utente (Iniziali e Nome)
  readonly user = computed<UserData>(() => {
    const currentUser = this.backendService.currentOperator();
    
    // Fallback di sicurezza se non c'è utente loggato
    if (!currentUser) {
      return { initials: 'SA', name: 'Super Admin' };
    }

    return {
      initials: (currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)).toUpperCase(),
      name: `${currentUser.firstName} ${currentUser.lastName}`
    };
  });

  // Gestione dinamica dei dati della lista
  readonly infoItems = computed<InfoItem[]>(() => {
    const currentUser = this.backendService.currentOperator();
    
    if (!currentUser) return [];

    const siteName = this.backendService.getSiteName(currentUser.siteId);

    return [
      { id: 'role', label: 'Ruolo', value: currentUser.role },
      { id: 'location', label: 'Sede', value: siteName },
      { id: 'email', label: 'Email', value: currentUser.email, isMonospace: true },
      // Il campo telefono non è presente in Operator dentro utils.ts, lo lasciamo fisso per ora
      { id: 'phone', label: 'Telefono', value: '+39 340 9988776', isMonospace: true }
    ];
  });

  // Bottom navigation state
  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'profile', label: 'Profilo', iconName: 'profile', isActive: true }
  ]);

  goBack(): void {
    // Naviga indietro alla dashboard del super admin
    this.router.navigate(['/s-admin-home']);
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