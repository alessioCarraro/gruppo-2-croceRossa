import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface ScadenzaProdotto {
  id: string;
  nome: string;
  lotto: string;
  quantita: number;
  dataScadenza: string;
  urgente: boolean;
}

@Component({
  selector: 'app-super-admin-expiring-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-expiring-products-component.html',
  styleUrls: ['./super-admin-expiring-products-component.css']
})
export class SuperAdminExpiringProductsComponent {
  private readonly router = inject(Router);
  private readonly backendService: MockBackendService = inject(MockBackendService);

  // Prodotti in scadenza dalle giacenze della metro (stessa fonte dell'Operator)
  readonly prodotti = computed<ScadenzaProdotto[]>(() =>
    this.backendService.expiringMetroStock().map(p => {
      // Formatta la data da YYYY-MM-DD a DD/MM/YYYY
      const dateParts = p.expiry.split('-');
      const formattedDate = dateParts.length === 3
        ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
        : p.expiry;

      return {
        id: p.productId,
        nome: p.name,
        lotto: 'L-' + p.productId.slice(0, 4).toUpperCase(), // codice lotto coerente con l'id
        quantita: p.stock,
        dataScadenza: formattedDate,
        urgente: true // Tutti quelli che arrivano qui sono in scadenza
      };
    })
  );

  // Somma totale delle quantità degli articoli in scadenza
  readonly totalItems = computed(() => 
    this.prodotti().reduce((accumulatore, prodotto) => accumulatore + prodotto.quantita, 0)
  );

  // Navigazione a ritroso verso la dashboard del super admin
  goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }
}