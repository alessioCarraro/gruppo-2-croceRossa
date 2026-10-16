import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductDetail {
  id: string;
  name: string;
  lot: string;
  expiry: string;
  quantity: number;
}

interface ColloDetails {
  id: string;
  status: string;
  source: string;
  category: string;
  totalPackages: number;
  arrivalDate: string;
}

@Component({
  selector: 'app-trackingNumber-ditails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tracking-number-ditails-component.html',
  styleUrls: ['./admin-tracking-number-ditails-component.css']
})
export class AdminTrackingNumberDitailsComponent {
  // Dati di dettaglio del collo gestiti tramite Signals
  readonly colloInfo = signal<ColloDetails>({
    id: 'COL-7781',
    status: 'Arrivato',
    source: 'Magazzino Centrale',
    category: 'Alimentari',
    totalPackages: 24,
    arrivalDate: 'oggi · 09:20'
  });

  // Lista dei prodotti nel collo
  readonly products = signal<ProductDetail[]>([
    {
      id: '1',
      name: 'Pasta di semola 500g',
      lot: 'C-9012',
      expiry: '15/05/2027',
      quantity: 200
    },
    {
      id: '2',
      name: 'Passata di pomodoro 700g',
      lot: 'C-9008',
      expiry: '20/08/2027',
      quantity: 150
    },
    {
      id: '3',
      name: 'Olio di semi 1L',
      lot: 'C-9001',
      expiry: '10/01/2027',
      quantity: 90
    }
  ]);

  goBack(): void {
    console.log('Navigazione indietro');
  }

  confirmReceipt(): void {
    console.log('Ricezione confermata per il collo:', this.colloInfo().id);
  }
}
