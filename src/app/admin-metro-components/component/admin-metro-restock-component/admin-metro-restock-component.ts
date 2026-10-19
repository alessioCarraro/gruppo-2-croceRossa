import { Component, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

interface OfficeLocation {
  id: string;
  name: string;
  requests: number;
}

interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'inventory' | 'upload' | 'restock';
  isActive: boolean;
  route?: string;
}

@Component({
  selector: 'app-admin-metro-restock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-restock-component.html',
  styleUrls: ['./admin-metro-restock-component.css']
})
export class AdminMetroRestockComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  public readonly locations = signal<OfficeLocation[]>([
    { id: '1', name: 'Sede 1', requests: 4 },
    { id: '2', name: 'Sede 2', requests: 3 },
    { id: '3', name: 'Sede 3', requests: 2 },
    { id: '4', name: 'Sede 4', requests: 0 }
  ]);

  public readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false, route: '/user-metro-dashboard' },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false, route: '/admin-metro-stock' },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false, route: '/admin-metro-load-item' },
    { id: 'restock', label: 'Rifornitura', iconName: 'restock', isActive: true, route: '/admin-metro-restock' }
  ]);

  public goBack(): void {
    this.location.back();
  }

  public selectLocation(office: OfficeLocation): void {
    console.info(`Selected location: ${office.name}`);
  }

  public changeTab(clickedItem: NavItem): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === clickedItem.id }))
    );

    if (clickedItem.route) {
      this.router.navigate([clickedItem.route]);
    }
  }
}