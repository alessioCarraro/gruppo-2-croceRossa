import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-metro-request-sent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-request-sent-component.html',
  styleUrls: ['./admin-metro-request-sent-component.css']
})
export class AdminMetroRequestSentComponent {
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
