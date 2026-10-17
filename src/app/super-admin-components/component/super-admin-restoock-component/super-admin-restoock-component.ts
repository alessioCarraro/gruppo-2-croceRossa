import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LocationRequest {
  id: string;
  name: string;
  requests: number;
}

interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'inventory' | 'upload' | 'restock' | 'approve';
  isActive: boolean;
}

@Component({
  selector: 'app-super-admin-restock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-restoock-component.html',
  styleUrls: ['./super-admin-restoock-component.css']
})
export class SuperAdminRestoockComponent {
  readonly locations = signal<LocationRequest[]>([
    { id: '1', name: 'Negozio Parabiago', requests: 4 },
    { id: '2', name: 'S. Vittore Olona', requests: 3 },
    { id: '3', name: 'Canegrate', requests: 2 },
    { id: '4', name: 'Busto Garolfo', requests: 0 }
  ]);

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornit.', iconName: 'restock', isActive: true },
    { id: 'approve', label: 'Approva', iconName: 'approve', isActive: false }
  ]);

  goBack(): void {
    console.log('Azione: Torna indietro');
  }

  selectLocation(loc: LocationRequest): void {
    console.log('Sede selezionata:', loc.name);
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
  }
}