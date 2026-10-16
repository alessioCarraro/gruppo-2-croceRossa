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
  colorClass: 'blue' | 'green' | 'black' | 'red';
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
  iconName: 'home' | 'inventory' | 'upload' | 'restock';
  isActive: boolean;
}

@Component({
  selector: 'app-user-metro-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-metro-dashboard-component.html',
  styleUrls: ['./user-metro-dashboard-component.css']
})
export class UserMetroDashboardComponent {
  // Dati utente
  readonly user = signal<UserProfile>({
    name: 'Giulia Russo',
    role: 'Magazzino'
  });

  // Metriche "Merci"
  readonly metrics = signal<MetricCard[]>([
    { id: '1', value: '38.4k', label: 'Articoli in magazzino', colorClass: 'black' },
    { id: '2', value: '15', label: 'Articoli in uscita', colorClass: 'black' },
    { id: '3', value: '8', label: 'Articoli in scadenza', colorClass: 'red', actionLabel: 'Visualizza'},
    { id: '4', value: '6', label: 'Richieste dalle sedi', colorClass: 'blue', actionLabel: 'Gestisci' }
  ]);

  // Voci "Controlli"
  readonly controls = signal<ControlItem[]>([
    { id: '1', iconName: 'users', title: 'Admin delle sedi', subtitle: 'referenti per sede', badgeValue: 6, badgeClass: 'gray' },
    { id: '2', iconName: 'users', title: 'Volontari delle sedi', subtitle: 'volontari in sede', badgeValue: 6, badgeClass: 'gray' }
  ]);

  // Voci "Bottom Navigation"
  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: true },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornitura', iconName: 'restock', isActive: false }
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
}