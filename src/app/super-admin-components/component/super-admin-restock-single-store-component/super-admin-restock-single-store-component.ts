import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMetroRestockSingleStoreComponent } from '../../../admin-metro-components/component/admin-metro-restock-sigle-store-component/admin-metro-restock-sigle-store-component';

/**
 * Pagina della sede per il Super Admin.
 * Estende quella dell'Operator e ne usa template e stili: richieste, catalogo con ricerca,
 * quantità e carrello sono gli stessi (stessi servizi e stessi dati). Cambiano solo le rotte.
 */
@Component({
  selector: 'app-super-admin-restock-single-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../../../admin-metro-components/component/admin-metro-restock-sigle-store-component/admin-metro-restock-sigle-store-component.html',
  styleUrls: ['../../../admin-metro-components/component/admin-metro-restock-sigle-store-component/admin-metro-restock-sigle-store-component.css']
})
export class SuperAdminRestockSingleStoreComponent extends AdminMetroRestockSingleStoreComponent {
  // Torna alla lista delle sedi del Super Admin
  public override goBack(): void {
    this.router.navigate(['/s-admin-restock']);
  }

  // Apre il carrello del Super Admin
  public override openCart(): void {
    this.router.navigate(['/s-admin-restock-summary']);
  }
}
