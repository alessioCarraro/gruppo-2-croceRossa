import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScadenzaProdotto {
  id: string;
  nome: string;
  lotto: string;
  quantita: number;
  dataScadenza: string;
  urgente: boolean;
}

@Component({
  selector: 'app-expiring-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expiring-products-component.html',
  styleUrls: ['./expiring-products-component.css']
})
export class ExpiringProductsComponent {
  // Lista dei prodotti (Single Source of Truth)
  readonly prodotti = signal<ScadenzaProdotto[]>([
    {
      id: '1',
      nome: 'Petto di pollo 1kg',
      lotto: 'C-8841',
      quantita: 25,
      dataScadenza: '30/10/2025',
      urgente: true
    },
    {
      id: '2',
      nome: 'Pasta integrale 500g',
      lotto: 'C-8830',
      quantita: 58,
      dataScadenza: '02/11/2025',
      urgente: true
    },
    {
      id: '3',
      nome: 'Omogeneizzato frutta',
      lotto: 'C-8795',
      quantita: 40,
      dataScadenza: '05/12/2025',
      urgente: false
    }
  ]);

  /**
   * Valore derivato dinamicamente: somma la 'quantita' di ogni prodotto.
   * Si aggiorna in automatico e in modo efficiente solo quando cambia 'prodotti()'.
   */
  readonly totalItems = computed(() => 
    this.prodotti().reduce((accumulatore, prodotto) => accumulatore + prodotto.quantita, 0)
  );

  goBack(): void {
    console.log('Naviga indietro');
  }
}