import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMetroRestockSummary } from '../../../admin-metro-components/component/admin-metro-restock-summary/admin-metro-restock-summary';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

/**
 * Carrello "Ordine di rifornimento" del Super Admin.
 * Estende quello dell'Operator (stesso carrello condiviso, stessa modifica quantità e rimozione).
 * Unica differenza: l'ordine parte direttamente, senza richiesta di conferma.
 */
@Component({
  selector: 'app-super-admin-restock-summary',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: '../../../admin-metro-components/component/admin-metro-restock-summary/admin-metro-restock-summary.html',
  styleUrls: ['../../../admin-metro-components/component/admin-metro-restock-summary/admin-metro-restock-summary.css']
})
export class SuperAdminRestockSummary extends AdminMetroRestockSummary {
  public override submitLabel = 'Invia ordine';
  // Il Super Admin non ha bisogno di conferma: niente banner di approvazione
  public override requiresApproval = false;

  /**
   * Invia subito l'ordine: crea la spedizione e segna come 'Inviata' le richieste incluse.
   * Solo se riesce, svuota il carrello e va alla pagina di conferma; altrimenti card di errore.
   */
  public override async submitOrder(): Promise<void> {
    if (this.isSubmitting() || this.orderItems().length === 0) return;

    this.isSubmitting.set(true);
    try {
      const items = this.orderItems().map(i => ({ productId: i.productId, quantity: i.quantity }));
      await this.backend.sendRestockShipment(this.cart.siteId(), items, this.cart.requestIds());

      // Salva il riepilogo per la pagina di conferma, poi svuota il carrello
      this.cart.markSent({ siteName: this.locationLabel(), productCount: items.length });
      this.cart.clear();

      await this.router.navigate(['/s-admin-order-sent'], { replaceUrl: true });
    } catch (error) {
      const reason = error instanceof Error ? ` (${error.message})` : '';
      this.notifications.error("Errore durante l'invio dell'ordine" + reason);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
