import { Component, signal } from '@angular/core';

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
  templateUrl: './admin-requests-component.html',
  styleUrls: ['./admin-requests-component.css']
})
export class RequestsComponent {
  
  pageTitle = signal('Richieste');
  pendingCount = signal(3);
  userRole = signal('Admin');

  extraTokenRequests = signal<TokenRequest[]>([
    {
      id: 'REQ-01',
      initials: 'BN',
      name: 'Luca Bianchi',
      subtitle: 'Token extra · da Sede Legnano · op. M. Turelli',
      status: 'In attesa',
      currentTokens: 0,
      maxTokens: 575,
      tokensToGrant: 288,
      reason: 'Nucleo numeroso',
      hasHistory: true
    },
    {
      id: 'REQ-02',
      initials: 'AV',
      name: 'Anna Verdi',
      subtitle: 'Token extra · da Sede Parabiago · op. G. Carraro',
      status: 'In attesa',
      currentTokens: 20,
      maxTokens: 400,
      tokensToGrant: 200,
      hasHistory: false
    }
  ]);

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
    console.log('Navigazione indietro');
  }

  acceptRequest(id: string, amount: number): void {
    console.log(`Richiesta ${id} accettata per +${amount} token`);
  }

  rejectRequest(id: string): void {
    console.log(`Richiesta ${id} rifiutata`);
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