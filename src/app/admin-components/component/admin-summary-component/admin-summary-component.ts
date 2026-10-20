import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminDeliveryService } from '../../../services/admin-delivery-service';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

@Component({
    selector: 'app-admin-summary',
    standalone: true,
    imports: [CommonModule, NotificationCardComponent],
    templateUrl: './admin-summary-component.html',
    styleUrls: ['./admin-summary-component.css']
})
export class AdminSummaryComponent {
    private readonly router = inject(Router);
    private readonly delivery = inject(AdminDeliveryService);
    private readonly notifications = inject(NotificationService);

    // Evita invii duplicati se si preme più volte "Conferma"
    public readonly isSubmitting = signal<boolean>(false);

    // Beneficiario: dati condivisi
    public readonly userInfo = computed(() => {
        const b = this.delivery.beneficiary();
        return {
            name: b ? `${b.firstName} ${b.lastName}` : 'Nessun beneficiario',
            orderId: b ? 'ID...' + b.code.slice(-4) : '-'
        };
    });

    // Solo i prodotti selezionati nella lista beni (quantità > 0), nessun dato fittizio
    public readonly products = this.delivery.selectedItems;

    // Totali: gli stessi calcolati nella lista beni (nessuna sottrazione doppia)
    public readonly totalTokensUsed = this.delivery.totalTokens;
    public readonly remainingTokens = this.delivery.remainingTokens;

    // Azioni (stessi limiti della lista beni: giacenza e saldo token)
    public incrementQuantity(productId: string): void {
        this.delivery.increment(productId);
    }

    public canIncrement(productId: string): boolean {
        return this.delivery.canIncrement(productId);
    }

    public decrementQuantity(productId: string): void {
        this.delivery.decrement(productId);
    }

    goBack(): void {
        this.router.navigate(['/admin-product-catalog']);
    }

    /**
     * Conferma la consegna: salva l'operazione, scala token e giacenze.
     * Solo se riesce apre la pagina di successo; altrimenti resta qui con un banner di errore
     * e la selezione intatta, così si può riprovare.
     */
    public async confirmDelivery(): Promise<void> {
        if (this.isSubmitting() || this.products().length === 0) return;

        this.isSubmitting.set(true);
        try {
            await this.delivery.confirm();
            await this.router.navigate(['/admin-delivery-success'], { replaceUrl: true });
        } catch (error) {
            const reason = error instanceof Error && error.message ? ` (${error.message})` : '';
            this.notifications.error('Errore durante la conferma della consegna' + reason);
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
