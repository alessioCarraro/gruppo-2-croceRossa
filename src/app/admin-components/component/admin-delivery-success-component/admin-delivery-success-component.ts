import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SummaryItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

@Component({
  selector: 'app-admin-delivery-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-delivery-success-component.html',
  styleUrls: ['./admin-delivery-success-component.css']
})
export class AdminDeliverySuccessComponent {
  // Stato del componente gestito tramite Signals
  public readonly pageTitle = signal<string>('Consegna registrata');
  public readonly pageSubtitle = signal<string>('Consegna salvata e stock locale aggiornato.');
  
  public readonly summaryDetails = signal<SummaryItem[]>([
    { label: 'Beneficiario', value: 'Mario Rossi' },
    { label: 'Numero prodotti', value: 3 },
    { label: 'Token usati', value: 50 },
    { label: 'Token residui', value: '370 / 575', highlight: true }
  ]);

  public navigateToDashboard(): void {
    console.log('Navigazione verso la dashboard Admin...');
  }

  public startNewIdentification(): void {
    console.log('Avvio nuova identificazione...');
  }
}