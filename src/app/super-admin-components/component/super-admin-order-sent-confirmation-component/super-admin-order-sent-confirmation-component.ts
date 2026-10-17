import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super-admin-order-sent-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-order-sent-confirmation-component.html',
  styleUrls: ['./super-admin-order-sent-confirmation-component.css']
})
export class SuperAdminOrderSentConfirmationComponent {
  // Gestione dello stato tramite Signals per i dati del riepilogo
  public destinationStore = signal<string>('Nome sede');
  public totalProductsSent = signal<number>(120);

  // Metodi per le azioni di navigazione
  public navigateToDashboard(): void {
    console.log('Navigazione verso la dashboard principale...');
    // Logica di routing (es. Router.navigate)
  }

  public startNewOrder(): void {
    console.log('Avvio di un nuovo ordine di rifornimento...');
    // Logica per resettare lo stato e tornare alla lista sedi
  }
}
