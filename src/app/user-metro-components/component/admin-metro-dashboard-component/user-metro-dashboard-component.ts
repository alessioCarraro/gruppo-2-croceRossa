import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Router } from '@angular/router';

// ... (le interfacce rimangono invariate per il Single Responsibility Principle)
interface UserProfile { name: string; role: string; }
interface MetricCard { id: string; value: string; label: string; colorClass: 'blue' | 'green' | 'black' | 'red'; actionLabel?: string; }
interface ControlItem { id: string; iconName: 'clock' | 'users'; title: string; subtitle: string; badgeValue: number; badgeClass: 'orange' | 'gray'; }
interface NavItem { id: string; label: string; iconName: 'home' | 'inventory' | 'upload' | 'restock'; isActive: boolean; }

@Component({
  selector: 'app-user-metro-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-metro-dashboard-component.html',
  styleUrls: ['./user-metro-dashboard-component.css']
})
export class UserMetroDashboardComponent {
  private readonly router = inject(Router);
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

  readonly controls = signal<ControlItem[]>([
    { id: '1', iconName: 'users', title: 'Admin delle sedi', subtitle: 'referenti per sede', badgeValue: 6, badgeClass: 'gray' },
    { id: '2', iconName: 'users', title: 'Volontari delle sedi', subtitle: 'volontari in sede', badgeValue: 6, badgeClass: 'gray' }
  ]);

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: true },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornitura', iconName: 'restock', isActive: false }
  ]);

  onLogout(): void {
    console.log('Azione: Logout');
    // Esempio futuro: this.authService.logout(); this.router.navigate(['/login']);
  }

  onProfile(): void {
    this.router.navigate(['/admin-metro-profile']);
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
  }
}