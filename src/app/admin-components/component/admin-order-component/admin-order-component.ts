import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { AdminOrderService } from '../../../services/admin-order-service';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

@Component({
    selector: 'app-admin-order',
    standalone: true,
    imports: [CommonModule, NotificationCardComponent],
    templateUrl: './admin-order-component.html',
    styleUrls: ['./admin-order-component.css']
})
export class AdminOrderComponent {
    private readonly router = inject(Router);
    private readonly backend = inject(MockBackendService);
    private readonly order = inject(AdminOrderService);
    private readonly notifications = inject(NotificationService);

    // Evita doppi invii mentre l'ordine è in corso
    readonly isSubmitting = signal<boolean>(false);

    readonly orderInfo = computed(() => ({
        orderId: 'ORD-' + this.backend.todayIso().replace(/-/g, ''),
        title: 'Nuovo ordine',
        destination: 'Magazzino Centrale',
        role: 'Admin'
    }));

    // Prodotti e quantità dell'ordine: bozza condivisa con il Magazzino
    readonly products = this.order.items;

    // Derivazioni
    readonly hasProducts = computed(() => this.products().length > 0);

    // Azioni
    goBack(): void {
        this.router.navigate(['/admin-warehouse']);
    }

    // Rimuove un prodotto dall'ordine
    removeProduct(productId: string): void {
        this.order.remove(productId);
    }

    // Cambia la quantità di un prodotto (minimo 1)
    changeQuantity(productId: string, quantity: number): void {
        this.order.setQuantity(productId, quantity);
    }

    /**
     * Invia l'ordine al magazzino centrale (richieste di riordino salvate nei dati condivisi).
     * Solo se riesce: svuota la bozza e torna al Magazzino, dove compare il banner "Ordine inviato".
     * Se fallisce: resta qui con un banner di errore e i prodotti/quantità inseriti.
     */
    async submitOrder(): Promise<void> {
        if (!this.hasProducts() || this.isSubmitting()) return;

        this.isSubmitting.set(true);
        try {
            const items = this.products().map(p => ({ productId: p.productId, quantity: p.quantity }));
            await this.backend.requestReorder(items);

            this.order.clear();
            // Il banner è nel servizio root: resta visibile nella pagina di destinazione
            this.notifications.success('Ordine inviato');
            await this.router.navigate(['/admin-warehouse'], { replaceUrl: true });
        } catch {
            this.notifications.error("Errore durante l'invio dell'ordine");
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
