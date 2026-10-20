import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SuperAdminExpiringProductsComponent } from '../../../super-admin-components/component/super-admin-expiring-products-component/super-admin-expiring-products-component';

/**
 * Pagina "Prossimi a scadenza" dell'Operator.
 * Estende quella del Super Admin: stessi dati (giacenze della metro dal MockBackendService)
 * e stesso calcolo del totale. Cambia solo il tasto indietro.
 */
@Component({
  selector: 'app-admin-metro-expiring-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-expiring-products-component.html',
  styleUrls: ['./admin-metro-expiring-products-component.css']
})
export class AdminMetroExpiringProductsComponent extends SuperAdminExpiringProductsComponent {
  private readonly location = inject(Location);

  // Torna alla pagina precedente (dashboard dell'Operator)
  public override goBack(): void {
    this.location.back();
  }
}
