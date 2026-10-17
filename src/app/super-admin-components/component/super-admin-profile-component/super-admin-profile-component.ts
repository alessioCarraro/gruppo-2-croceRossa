import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfacce per tipizzazione stretta
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
  // Gestione dello stato utente
  readonly user = signal<UserData>({
    initials: 'VB',
    name: 'Valeria Bianchi',
  });

  // Gestione dei dati della lista
  readonly infoItems = signal<InfoItem[]>([
    { id: 'role', label: 'Ruolo', value: 'Super Admin' },
    { id: 'location', label: 'Sede', value: 'Magazzino Centrale' },
    { id: 'email', label: 'Email', value: 'v.bianchi@foodnetwork.it', isMonospace: true },
    { id: 'phone', label: 'Telefono', value: '+39 340 9988776', isMonospace: true }
  ]);

  // Bottom navigation state
  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'profile', label: 'Profilo', iconName: 'profile', isActive: true }
  ]);

  goBack(): void {
    console.log('Azione: Torna indietro');
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