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

  // Lista dinamica dei prodotti in scadenza presi direttamente da MockBackendService
  readonly prodotti = computed<ScadenzaProdotto[]>(() => {
    const products = this.backendService.products();

    // Filtra solo i prodotti con il flag isExpiringSoon attivo
    return products
      .filter(p => p.isExpiringSoon)
      .map(p => {
        // Formatta la data da YYYY-MM-DD a DD/MM/YYYY
        const dateParts = p.expiry.split('-');
        const formattedDate = dateParts.length === 3 
          ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` 
          : p.expiry;

        // Genera un codice lotto finto coerente (es: 'L-' + ultime 4 cifre dell'ID)
        const lottoCode = 'L-' + p.id.slice(0, 4).toUpperCase();

        return {
          id: p.id,
          nome: p.name,
          lotto: lottoCode,
          quantita: p.stock,
          dataScadenza: formattedDate,
          urgente: true // Tutti quelli che arrivano qui sono urgenti/in scadenza
        };
      });
  });

  // Somma totale delle quantità degli articoli in scadenza
  readonly totalItems = computed(() => 
    this.prodotti().reduce((accumulatore, prodotto) => accumulatore + prodotto.quantita, 0)
  );

  // Navigazione a ritroso verso la dashboard del super admin
  goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }
}