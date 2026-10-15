import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

@Component({
  selector: 'app-delivery-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-success-component.html',
  styleUrls: ['./delivery-success-component.css']
})
export class DeliverySuccessComponent {
  // Stato del componente gestito tramite Signals
  public readonly pageTitle = signal<string>('Consegna registrata');
  public readonly pageSubtitle = signal<string>('Consegna salvata e stock locale aggiornato.');
  
  public readonly summaryDetails = signal<SummaryItem[]>([
    { label: 'Beneficiario', value: 'Mario Rossi' },
    { label: 'Numero prodotti', value: 3 },
    { label: 'Token usati', value: 50 },
    { label: 'Token residui', value: '370 / 575', highlight: true }
  ]);

  // Azioni
  public navigateToDashboard(): void {
    console.log('Navigazione verso la dashboard...');
  }

  public startNewIdentification(): void {
    console.log('Avvio nuova identificazione...');
  }
}