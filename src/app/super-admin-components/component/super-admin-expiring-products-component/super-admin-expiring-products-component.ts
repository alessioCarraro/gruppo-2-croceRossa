import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);
  protected readonly backendService: MockBackendService = inject(MockBackendService);

  /**
   * Sede di cui mostrare le scadenze: arriva dalla dashboard (?siteId=...).
   * Senza sede mostra tutte le sedi. L'Operator la sostituisce con la metro.
   */
  protected getSiteId(): string | null {
    return this.route.snapshot.queryParamMap.get('siteId');
  }

  // Articoli in scadenza: stessi dati e stesso criterio del conteggio nelle dashboard
  readonly prodotti = computed<ScadenzaProdotto[]>(() => {
    const siteId = this.getSiteId();

    return this.backendService.expiringStock(siteId).map(p => {
      // Formatta la data da YYYY-MM-DD a DD/MM/YYYY
      const dateParts = p.expiry.split('-');
      const formattedDate = dateParts.length === 3
        ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
        : p.expiry;

      // Codice lotto coerente con l'id; con tutte le sedi si indica anche la sede
      const lotto = 'L-' + p.productId.slice(0, 4).toUpperCase();

      return {
        id: p.productId + p.siteName,
        nome: p.name,
        lotto: siteId ? lotto : `${p.siteName} · ${lotto}`,
        quantita: p.stock,
        dataScadenza: formattedDate,
        urgente: true // Tutti quelli che arrivano qui sono in scadenza
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