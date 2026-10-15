import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [FormsModule], // Obbligatorio per [ngModel]
  templateUrl: './admin-home-component.html',
  styleUrls: ['./admin-home-component.css']
})
export class AdminHomeComponent {
  // Gestione dello stato tramite Signals
  readonly searchQuery = signal(''); // Signal per la barra di ricerca

  readonly userProfile = signal({
    name: 'Marta',
    storeName: 'Negozio Legnano',
    storeAddress: 'Via Gilardelli',
    role: 'Admin',
    initial: 'person'
  });

  readonly statsToday = signal([
    { value: '41', label: 'Consegne registrate', subLabel: 'rete locale', actionText: null, actionType: null },
    { value: '5', label: 'Colli in arrivo', subLabel: null, actionText: 'conferma ricezione', actionType: 'primary' },
    { value: '7', label: 'Prodotti in esaurimento', subLabel: null, actionText: 'aggiungi all\'ordine', actionType: 'danger' },
    { value: '12', label: 'Prossimi a scadenza', subLabel: null, actionText: 'entro 14 gg', actionType: 'warning' }
  ]);
}