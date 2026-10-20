import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SuperAdminAdminLocationsComponent } from '../../../super-admin-components/component/super-admin-admin-locations/super-admin-admin-locations';

/**
 * Elenco dei referenti delle sedi per l'Operator.
 * Estende quello del Super Admin: stessi dati (operatori dal MockBackendService),
 * nessun array separato. Cambia solo il tasto indietro.
 */
@Component({
  selector: 'app-admin-metro-admin-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-admin-locations.html',
  styleUrls: ['./admin-metro-admin-locations.css']
})
export class AdminMetroAdminLocationsComponent extends SuperAdminAdminLocationsComponent {
  private readonly location = inject(Location);

  /**
   * Riporta l'utente alla schermata precedente (Dashboard)
   */
  public override goBack(): void {
    this.location.back();
  }
}
