import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  iconName: 'home' | 'inventory' | 'upload' | 'restock' | 'approve'; // Aggiunto 'approve'
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
  // Dati utente
  readonly user = signal<UserProfile>({
    name: 'Valeria Bianchi',
    role: 'Super Admin'
  });

  // Gestione Dropdown Sedi
  readonly locations = signal<string[]>(['Magazzino Centrale', 'Sede1', 'Sede2', 'Sede3']);
  readonly selectedLocation = signal<string>('Magazzino Centrale');
  readonly isDropdownOpen = signal<boolean>(false);

  // Metriche "Statistiche"
  readonly metrics = signal<MetricCard[]>([
    { id: '1', value: '245K', label: 'Valore giacenze  totale', colorClass: 'black' },
    { id: '2', value: '1280', label: 'Articoli a catalogo', colorClass: 'black' },
    { id: '3', value: '48', label: 'Articoli in scadenza (entro 30 giorni)', colorClass: 'orange', actionLabel: 'visualizza articoli' },
    { id: '4', value: '3420', label: 'Valore prodotti scaduti (ultimi 30 giorni)', colorClass: 'red' }
  ]);

  // Voci "Controlli"
  readonly controls = signal<ControlItem[]>([
    { id: '1', iconName: 'users', title: 'Admin delle sedi', subtitle: 'referenti per sede', badgeValue: 6, badgeClass: 'gray' },
    { id: '2', iconName: 'users', title: 'Volontari delle sedi', subtitle: 'volontari in sede', badgeValue: 6, badgeClass: 'gray' }
  ]);

  // Voci "Bottom Navigation" (Aggiornate come da immagine)
  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: true },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornit.', iconName: 'restock', isActive: false },
    { id: 'approve', label: 'Approva', iconName: 'approve', isActive: false }
  ]);

  // Azioni
  onLogout(): void {
    console.log('Azione: Logout');
  }

  onProfile(): void {
    console.log('Azione: Profilo utente');
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
  }

  // Azioni Dropdown
  toggleDropdown(): void {
    this.isDropdownOpen.update(val => !val);
  }

  selectLocation(location: string): void {
    this.selectedLocation.set(location);
    this.isDropdownOpen.set(false);
    console.log('Sede selezionata:', location);
  }
}