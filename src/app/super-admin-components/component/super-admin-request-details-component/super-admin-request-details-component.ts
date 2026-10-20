import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

interface OrderProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

@Component({
  selector: 'app-super-admin-request-details',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './super-admin-request-details-component.html',
  styleUrls: ['./super-admin-request-details-component.css']
})
export class SuperAdminRequestDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly backendService = inject(MockBackendService);
  private readonly notifications = inject(NotificationService);

  private currentRequestId: string | null = null;
  // Vero se la richiesta contiene un elenco di articoli (es. ordine di rifornimento)
  private hasItems = false;
  // Evita doppi click mentre l'azione è in corso
  public isProcessing = signal<boolean>(false);
  public requestType = signal<string>('Riordino');

  readonly orderInfo = signal({
    status: 'In attesa',
    location: 'Sede Centrale',
    admin: 'Operatore Sede',
    date: '19/10/2026',
    time: '10:00'
  });

  readonly requestedProducts = signal<OrderProduct[]>([]);

  // La "X" di rimozione compare solo se ci sono almeno due prodotti:
  // la richiesta non può restare vuota (e la quantità dei token non si può togliere)
  readonly canRemove = computed<boolean>(() => this.requestedProducts().length >= 2);

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
    // Sede della richiesta: quella indicata nella richiesta, altrimenti quella di chi l'ha inviata
    const site = sites.find(s => s.id === targetReq.siteId) ?? (op ? sites.find(s => s.id === op.siteId) : sites[0]);
    const adminName = op ? `${op.firstName} ${op.lastName}` : 'Ente Distributore';

    const reqDate = targetReq.date ? new Date(targetReq.date) : new Date();

    this.orderInfo.set({
      status: targetReq.status,
      location: site ? site.name : 'Sede Centrale',
      admin: adminName,
      date: reqDate.toLocaleDateString('it-IT'),
      time: reqDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    });

    if (targetReq.items && targetReq.items.length > 0) {
      // Richiesta con più articoli
      this.hasItems = true;
      this.requestedProducts.set(targetReq.items.map(item => {
        const prod = this.backendService.getProduct(item.productId);
        return {
          id: item.productId,
          name: prod ? prod.name : 'Prodotto sconosciuto',
          category: prod ? `${prod.category} · ${prod.unit}` : '',
          quantity: item.quantity
        };
      }));
    } else if (targetReq.productId) {
      // Richiesta singola con un solo prodotto
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
      // Richiesta di token: la quantità è quella richiesta e non si può modificare
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

  // Rimuove un prodotto dalla richiesta (solo se ce ne sono almeno due)
  removeProduct(id: string): void {
    if (!this.canRemove()) return;
    this.requestedProducts.update(products =>
      products.filter(p => p.id !== id)
    );
  }

  goBack(): void {
    this.router.navigate(['/s-admin-approval-requests']);
  }

  // Conferma: salva l'approvazione (con gli articoli rimasti), mostra l'alert e torna alla lista
  async confirmRequest(): Promise<void> {
    if (!this.currentRequestId || this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
      const items = this.hasItems
        ? this.requestedProducts().map(p => ({ productId: p.id, quantity: p.quantity }))
        : undefined;
      await this.backendService.decideApproval(this.currentRequestId, 'Approvata', items);
      this.notifications.success('Richiesta confermata con successo');
      await this.router.navigate(['/s-admin-approval-requests']);
    } catch {
      this.notifications.error('Errore durante la conferma della richiesta');
    } finally {
      this.isProcessing.set(false);
    }
  }

  // Rifiuta: imposta lo stato su Rifiutata (esce dalle richieste in attesa), mostra l'alert e torna alla lista
  async rejectRequest(): Promise<void> {
    if (!this.currentRequestId || this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
      await this.backendService.decideApproval(this.currentRequestId, 'Rifiutata');
      this.notifications.info('Richiesta rifiutata');
      await this.router.navigate(['/s-admin-approval-requests']);
    } catch {
      this.notifications.error('Errore durante il rifiuto della richiesta');
    } finally {
      this.isProcessing.set(false);
    }
  }
}
