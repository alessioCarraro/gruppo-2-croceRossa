import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface UserProfile { name: string; role: string; }
interface MetricCard { id: string; value: string; label: string; colorClass: 'blue' | 'green' | 'black' | 'red'; actionLabel?: string; }
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

  private readonly activeTab = signal<string>('home');
  
  readonly user = signal<UserProfile>({
    name: 'Giulia Russo',
    role: 'Magazzino'
  });

  readonly metrics = signal<MetricCard[]>([
    { id: '1', value: '38.4k', label: 'Articoli in magazzino', colorClass: 'black' },
    { id: '2', value: '15', label: 'Articoli in uscita', colorClass: 'black' },
    { id: '3', value: '8', label: 'Articoli in scadenza', colorClass: 'red', actionLabel: 'Visualizza'},
    { id: '4', value: '6', label: 'Richieste dalle sedi', colorClass: 'blue', actionLabel: 'Gestisci' }
  ]);

  readonly controls = signal<ControlItem[]>([
    { id: 'admins', iconName: 'users', title: 'Admin delle sedi', subtitle: 'referenti per sede', badgeValue: 6, badgeClass: 'gray', route: '/user-metro-admin-location' },
    { id: 'volunteers', iconName: 'users', title: 'Volontari delle sedi', subtitle: 'volontari in sede', badgeValue: 6, badgeClass: 'gray', route: '/user-metro-user-location' }
  ]);

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