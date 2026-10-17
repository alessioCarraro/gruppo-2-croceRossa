import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ApprovalRequest {
  id: string;
  initials: string;
  location: string;
  userName: string;
  productCount: number;
  date: string;
  time: string;
  status: string;
}

interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'inventory' | 'upload' | 'restock' | 'approve';
  isActive: boolean;
}

@Component({
  selector: 'app-super-admin-approval-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-approval-requests-component.html',
  styleUrls: ['./super-admin-approval-requests-component.css']
})
export class SuperAdminApprovalRequestsComponent {
  // Dati delle richieste
  readonly requests = signal<ApprovalRequest[]>([
    {
      id: '1',
      initials: 'LB',
      location: 'Negozio Parabiago',
      userName: 'Luca Beretta',
      productCount: 4,
      date: '15/10',
      time: '09:20',
      status: 'In attesa'
    },
    {
      id: '2',
      initials: 'SV',
      location: 'S. Vittore Olona',
      userName: 'Sara Villa',
      productCount: 3,
      date: '15/10',
      time: '08:50',
      status: 'In attesa'
    },
    {
      id: '3',
      initials: 'PR',
      location: 'Canegrate',
      userName: 'Paolo Riva',
      productCount: 2,
      date: '14/10',
      time: '17:10',
      status: 'In attesa'
    }
  ]);

  // Logica richiesta extra: il numero totale corrisponde all'effettivo numero di richieste (elementi nell'array)
  readonly totalRequests = computed(() => this.requests().length);

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornit.', iconName: 'restock', isActive: false },
    { id: 'approve', label: 'Approva', iconName: 'approve', isActive: true }
  ]);

  goBack(): void {
    console.log('Naviga indietro');
  }

  selectRequest(req: ApprovalRequest): void {
    console.log('Richiesta selezionata:', req.location);
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
  }
}