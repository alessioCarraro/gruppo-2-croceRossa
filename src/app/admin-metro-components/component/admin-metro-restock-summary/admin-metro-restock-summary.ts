import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { RestockCartService } from '../../../services/restock-cart-service';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

@Component({
  selector: 'app-admin-metro-restock-summary',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './admin-metro-restock-summary.html',
  styleUrls: ['./admin-metro-restock-summary.css']
})
export class AdminMetroRestockSummary {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly backend = inject(MockBackendService);
  private readonly cart = inject(RestockCartService);
  private readonly notifications = inject(NotificationService);

  // Sede di destinazione dell'ordine
  public locationLabel = computed(() => this.backend.getSiteName(this.cart.siteId()));

  // Prodotti realmente aggiunti al carrello (nessun dato di esempio)
  public orderItems = this.cart.items;

  // Evita doppi invii mentre la richiesta è in corso
  public isSubmitting = signal<boolean>(false);

  public goBack(): void {
    this.location.back();
  }

  public removeItem(productId: string): void {
    this.cart.removeItem(productId);
  }

  // Modifica la quantità di una riga (con 0 la riga viene rimossa)
  public changeQuantity(productId: string, quantity: number): void {
    this.cart.setQuantity(productId, quantity);
  }

  /**
   * Invia l'ordine a richiesta di approvazione del superadmin.
   * Solo se l'invio riesce: svuota il carrello e va alla pagina di conferma.
   * Se fallisce: mostra la card di errore e resta qui.
   */
  public async submitOrder(): Promise<void> {
    if (this.isSubmitting() || this.orderItems().length === 0) return;

    this.isSubmitting.set(true);
    try {
      const items = this.orderItems().map(i => ({ productId: i.productId, quantity: i.quantity }));
      // Le richieste di riordino nel carrello passano a 'Inviata' e non compaiono più nella sede
      await this.backend.requestRestockApproval(this.cart.siteId(), items, this.cart.requestIds());

      // Salva il riepilogo per la pagina di conferma, poi svuota il carrello
      this.cart.markSent({ siteName: this.locationLabel(), productCount: items.length });
      this.cart.clear();

      await this.router.navigate(['/user-metro-request-sent'], { replaceUrl: true });
    } catch {
      this.notifications.error("Errore durante l'invio della richiesta. Riprova.");
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
