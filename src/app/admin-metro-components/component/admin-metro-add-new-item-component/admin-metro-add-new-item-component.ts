import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SuperAdminAddNewItemComponent } from '../../../super-admin-components/component/super-admin-add-new-item-component/super-admin-add-new-item-component';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

/**
 * Pagina "Carico nuovo" dell'operator.
 * Estende quella del super admin e ne usa lo stesso template e gli stessi stili:
 * layout, campi e comportamento sono identici. Cambia solo il pulsante in basso,
 * che invia la richiesta a conferma del superadmin invece di salvare direttamente.
 */
@Component({
  selector: 'app-admin-metro-add-new-item',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: '../../../super-admin-components/component/super-admin-add-new-item-component/super-admin-add-new-item-component.html',
  styleUrls: ['../../../super-admin-components/component/super-admin-add-new-item-component/super-admin-add-new-item-component.css']
})
export class AdminMetroAddNewItemComponent extends SuperAdminAddNewItemComponent {
  private readonly location = inject(Location);
  private readonly notifications = inject(NotificationService);

  // Testo del pulsante in basso
  public override submitLabel = 'Invia a conferma del superadmin';

  // Pulsante indietro: torna alla pagina precedente senza inviare nulla
  public override goBack(): void {
    this.location.back();
  }

  /**
   * Invia il nuovo articolo in coda "In attesa" di conferma del superadmin,
   * poi torna ad "Aggiungi carico" dove compare la card informativa.
   */
  public override async submitForm(event?: Event): Promise<void> {
    if (event) event.preventDefault();
    if (this.isSubmitting()) return;

    // Stessi controlli della pagina super admin (campi mancanti o non validi)
    const missingFields = this.getMissingFields();
    if (missingFields.length > 0) {
      this.notifications.error('Compila o correggi i campi: ' + missingFields.join(', '));
      return;
    }

    this.isSubmitting.set(true);
    try {
      // Descrizione della richiesta mostrata al superadmin
      const description = `Nuovo prodotto: ${this.productType().trim()} (${this.macroCategory()} / ${this.category()}), ` +
        `quantità ${this.quantity()}, scadenza ${this.expiryDate()}, token ${this.tokenValue()}`;

      // Metto la richiesta in coda tra le approvazioni (stato "In attesa")
      await this.backendService.requestNewProductApproval(description);

      // La card è nel servizio root: sarà visibile nella pagina di destinazione
      this.notifications.info('Articolo inviato: in attesa di conferma del superadmin');
      // replaceUrl: sostituisce questa pagina nella cronologia
      await this.router.navigate(['/user-metro-load-item'], { replaceUrl: true });
    } catch {
      this.notifications.error("Errore durante l'invio dell'articolo al superadmin");
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
