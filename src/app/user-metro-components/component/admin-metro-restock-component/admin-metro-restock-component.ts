import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OfficeLocation {
  id: string;
  name: string;
  requests: number;
}

interface NavItem {
  id: string;
  label: string;
  iconPath: string;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-metro-restock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-restock-component.html',
  styleUrls: ['./admin-metro-restock-component.css']
})
export class AdminMetroRestockComponent {
  // Gestione dello stato tramite Signals
  public readonly locations = signal<OfficeLocation[]>([
    { id: '1', name: 'Sede 1', requests: 4 },
    { id: '2', name: 'Sede 2', requests: 3 },
    { id: '3', name: 'Sede 3', requests: 2 },
    { id: '4', name: 'Sede 4', requests: 0 }
  ]);

  public readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', isActive: false },
    { id: 'inventario', label: 'Inventario', iconPath: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', isActive: false },
    { id: 'carico', label: 'Carico', iconPath: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3', isActive: false },
    { id: 'rifornitura', label: 'Rifornitura', iconPath: 'M8 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM16 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM4 6h3.5l2.5 6.5h6l2.5-3.5H20', isActive: true }
  ]);

  public goBack(): void {
    console.log('Navigating back...');
  }

  public selectLocation(location: OfficeLocation): void {
    console.log(`Selected location: ${location.name}`);
  }

  public changeTab(tabId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === tabId }))
    );
  }
}
