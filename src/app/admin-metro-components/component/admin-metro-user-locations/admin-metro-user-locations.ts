import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SuperAdminUserLocationsComponent } from '../../../super-admin-components/component/super-admin-user-locations/super-admin-user-locations';

/**
 * Elenco dei volontari delle sedi per l'Operator.
 * Estende quello del Super Admin: stessi dati (operatori dal MockBackendService),
 * nessun array separato. Cambia solo il tasto indietro.
 */
@Component({
  selector: 'app-admin-metro-user-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-user-locations.html',
  styleUrls: ['./admin-metro-user-locations.css']
})
export class AdminMetroUserLocationsComponent extends SuperAdminUserLocationsComponent {
  private readonly location = inject(Location);

  /**
   * Riporta l'utente alla schermata precedente (Dashboard)
   */
  public override goBack(): void {
    this.location.back();
  }
}
