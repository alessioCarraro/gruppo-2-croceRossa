import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface OrderProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

@Component({
  selector: 'app-super-admin-request-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-request-details-component.html',
  styleUrls: ['./super-admin-request-details-component.css']
})
export class SuperAdminRequestDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly backendService = inject(MockBackendService);

  private currentRequestId: string | null = null;
  public requestType = signal<string>('Riordino');

  readonly orderInfo = signal({
    status: 'In attesa',
    location: 'Sede Centrale',
    admin: 'Operatore Sede',
    date: '19/10/2026',
    time: '10:00'
  });

  readonly requestedProducts = signal<OrderProduct[]>([]);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.currentRequestId = id;
        this.loadRequestData(id);
      }
    });
  }

  private loadRequestData(id: string): void {
    const approvals = this.backendService.approvals();
    const targetReq = approvals.find(a => a.id === id);

    if (!targetReq) return;

    this.requestType.set(targetReq.type);

    const sites = this.backendService.sites();
    const operators = this.backendService.operators();
    const op = operators.find(o => o.id === targetReq.requestedBy);
    const site = op ? sites.find(s => s.id === op.siteId) : sites[0];
    const adminName = op ? `${op.firstName} ${op.lastName}` : 'Ente Distributore';

    const reqDate = targetReq.date ? new Date(targetReq.date) : new Date();

    this.orderInfo.set({
      status: targetReq.status,
      location: site ? site.name : 'Sede Centrale',
      admin: adminName,
      date: reqDate.toLocaleDateString('it-IT'),
      time: reqDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    });

    if (targetReq.productId) {
      const prod = this.backendService.getProduct(targetReq.productId);
      if (prod) {
        this.requestedProducts.set([
          {
            id: prod.id,
            name: prod.name,
            category: `${prod.category} · ${prod.unit}`,
            quantity: targetReq.quantity || 1
          }
        ]);
      }
    } else if (targetReq.type === 'Token extra') {
      const beneficiaries = this.backendService.beneficiaries();
      const ben = beneficiaries.find(b => b.id === targetReq.beneficiaryId);
      const benName = ben ? `${ben.firstName} ${ben.lastName}` : 'Beneficiario';

      this.requestedProducts.set([
        {
          id: 'token-extra',
          name: targetReq.description,
          category: `Token Extra (+50%) · ${benName}`,
          quantity: targetReq.extraTokens || 0
        }
      ]);
    }
  }

  increaseQuantity(id: string): void {
    this.requestedProducts.update(products =>
      products.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p)
    );
  }

  decreaseQuantity(id: string): void {
    this.requestedProducts.update(products =>
      products.map(p => p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)
    );
  }

  removeProduct(id: string): void {
    this.requestedProducts.update(products => 
      products.filter(p => p.id !== id)
    );
  }

  goBack(): void {
    this.router.navigate(['/s-admin-approval-requests']);
  }

  async confirmRequest(): Promise<void> {
    if (!this.currentRequestId) return;
    try {
      await this.backendService.decideApproval(this.currentRequestId, 'Approvata');
      this.router.navigate(['/s-admin-approval-requests']);
    } catch (error) {
      console.error('Errore durante l\'approvazione', error);
    }
  }

  async rejectRequest(): Promise<void> {
    if (!this.currentRequestId) return;
    try {
      // Imposta lo stato su Rifiutata, facendola così filtrare via dalla lista delle attese
      await this.backendService.decideApproval(this.currentRequestId, 'Rifiutata');
      this.router.navigate(['/s-admin-approval-requests']);
    } catch (error) {
      console.error('Errore durante il rifiuto', error);
    }
  }
}