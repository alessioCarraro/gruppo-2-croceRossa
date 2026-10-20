import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface ApprovalRequestUI {
  id: string;
  initials: string;
  location: string;
  userName: string;
  type: string;
  description: string;
  metaText: string;
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
  private readonly router = inject(Router);
  private readonly backendService = inject(MockBackendService);

  public searchQuery = signal<string>('');

  readonly requests = computed<ApprovalRequestUI[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allApprovals = this.backendService.approvals();
    const sites = this.backendService.sites();
    const operators = this.backendService.operators();

    const pendingApprovals = allApprovals.filter(a => a.status === 'In attesa');

    const mappedRequests: ApprovalRequestUI[] = pendingApprovals.map((req, index) => {
      const op = operators.find(o => o.id === req.requestedBy);
      const site = op ? sites.find(s => s.id === op.siteId) : sites[0];
      const userName = op ? `${op.firstName} ${op.lastName}` : 'Ente Distributore';
      const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

      let metaText = req.description;
      if (req.type === 'Token extra') {
        metaText = `Token extra (+50%)`;
      } else if (req.type === 'Riordino' && req.quantity) {
        metaText = `Riordino ${req.quantity} pezzi`;
      }

      return {
        id: req.id,
        initials: initials || 'ED',
        location: site ? site.name : 'Sede Centrale',
        userName: `${userName} · ${req.type}`,
        type: req.type,
        description: req.description,
        metaText: metaText,
        productCount: req.quantity ? req.quantity : 1,
        date: req.date ? new Date(req.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }) : '19/10',
        time: '10:00',
        status: req.status
      };
    });

    if (!query) return mappedRequests;
    return mappedRequests.filter(r => r.location.toLowerCase().includes(query));
  });

  readonly totalRequests = computed<number>(() => this.requests().length);

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'restock', label: 'Rifornit.', iconName: 'restock', isActive: false },
    { id: 'approve', label: 'Approva', iconName: 'approve', isActive: true }
  ]);

  public updateSearchQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }

  selectRequest(req: ApprovalRequestUI): void {
    this.router.navigate(['/s-admin-request-details'], { queryParams: { id: req.id } });
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
    switch (navId) {
      case 'home': this.router.navigate(['/s-admin-home']); break;
      case 'inventory': this.router.navigate(['/s-admin-metro-stock']); break;
      case 'upload': this.router.navigate(['/s-admin-load-item']); break;
      case 'restock': this.router.navigate(['/s-admin-restock']); break;
      case 'approve': this.router.navigate(['/s-admin-approval-requests']); break;
    }
  }
}