import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

interface ScadenzaProdotto {
  id: string;
  nome: string;
  lotto: string;
  quantita: number;
  dataScadenza: string;
  urgente: boolean;
}

@Component({
  selector: 'app-admin-metro-expiring-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-expiring-products-component.html',
  styleUrls: ['./admin-metro-expiring-products-component.css']
})
export class AdminMetroExpiringProductsComponent {
  // Iniezione del servizio Location per tornare alla dashboard
  private readonly location = inject(Location);

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
    this.location.back();
  }
}
