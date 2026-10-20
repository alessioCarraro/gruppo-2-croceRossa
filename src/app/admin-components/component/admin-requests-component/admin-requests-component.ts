import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

export interface TokenRequest {
  id: string;
  initials: string;
  name: string;
  subtitle: string;
  status: string;
  currentTokens: number;
  maxTokens: number;
  tokensToGrant: number;
  reason?: string;
  hasHistory: boolean;
}

export interface OutOfStockProduct {
  id: string;
  name: string;
  status: string;
  isOrdered: boolean;
}

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [NotificationCardComponent],
  templateUrl: './admin-requests-component.html',
  styleUrls: ['./admin-requests-component.css']
})
export class RequestsComponent {
  private readonly router = inject(Router);
  private readonly backend = inject(MockBackendService);
  private readonly notifications = inject(NotificationService);

  pageTitle = signal('Richieste');
  userRole = computed(() => this.backend.currentOperator()?.role ?? 'Admin');

  // Id delle richieste con un'azione in corso (blocca i doppi click)
  private readonly processingIds = signal<string[]>([]);

  /**
   * Richieste di token extra in attesa per la sede dell'Admin.
   * Stessa fonte dati di dashboard e Super Admin: accettata o rifiutata, la richiesta esce dall'elenco.
   */
  extraTokenRequests = computed<TokenRequest[]>(() => {
    const siteId = this.backend.currentSite()?.id;

    return this.backend.pendingTokenRequestsForSite(siteId).map(request => {
      const beneficiary = this.backend.beneficiaries().find(b => b.id === request.beneficiaryId);
      const name = beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : 'Beneficiario';

      return {
        id: request.id,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        name,
        subtitle: `Token extra · da ${this.backend.getSiteName(siteId ?? '')} · op. ${this.backend.getOperatorName(request.requestedBy)}`,
        status: 'In attesa',
        currentTokens: beneficiary?.tokens ?? 0,
        maxTokens: beneficiary ? this.backend.getMaxTokens(beneficiary) : 0,
        tokensToGrant: request.extraTokens ?? 0,
        reason: undefined,
        hasHistory: beneficiary ? this.backend.deliveries().some(d => d.beneficiaryId === beneficiary.id) : false
      };
    });
  });

  // Contatore in alto: numero reale di richieste rimaste (stesso elenco delle card)
  pendingCount = computed(() => this.extraTokenRequests().length);

  outOfStockProducts = signal<OutOfStockProduct[]>([
    {
      id: 'PROD-01',
      name: 'Omogeneizzato carne',
      status: 'Esaurito',
      isOrdered: true
    },
    {
      id: 'PROD-02',
      name: 'Pannolini Taglia 4',
      status: 'Esaurito',
      isOrdered: false
    },
    {
      id: 'PROD-03',
      name: 'Latte in polvere 1',
      status: 'Esaurito',
      isOrdered: false
    }
  ]);

  goBack(): void {
    this.router.navigate(['/admin-home']);
  }

  // Vero se per la richiesta c'è già un'azione in corso
  isProcessing(id: string): boolean {
    return this.processingIds().includes(id);
  }

  /**
   * Accetta o rifiuta la richiesta: salva la decisione nei dati condivisi e resta in questa pagina.
   * Se riesce la card sparisce da sola (la lista è calcolata dai dati) e il contatore scende.
   * Se fallisce: banner di errore, la card resta e si può riprovare.
   */
  private async decide(id: string, status: 'Approvata' | 'Rifiutata'): Promise<void> {
    if (this.isProcessing(id)) return;

    this.processingIds.update(ids => [...ids, id]);
    try {
      await this.backend.decideApproval(id, status);
      if (status === 'Approvata') {
        this.notifications.success('Richiesta accettata con successo');
      } else {
        this.notifications.info('Richiesta rifiutata');
      }
    } catch {
      this.notifications.error(status === 'Approvata'
        ? "Errore durante l'accettazione della richiesta"
        : 'Errore durante il rifiuto della richiesta');
    } finally {
      this.processingIds.update(ids => ids.filter(x => x !== id));
    }
  }

  acceptRequest(id: string, amount: number): void {
    void this.decide(id, 'Approvata');
  }

  rejectRequest(id: string): void {
    void this.decide(id, 'Rifiutata');
  }

  toggleHistory(id: string): void {
    console.log(`Apertura storico per ${id}`);
  }

  placeOrder(productId: string): void {
    this.outOfStockProducts.update((products) =>
      products.map((product) =>
        product.id === productId
          ? { ...product, isOrdered: true }
          : product
      )
    );
  }
}