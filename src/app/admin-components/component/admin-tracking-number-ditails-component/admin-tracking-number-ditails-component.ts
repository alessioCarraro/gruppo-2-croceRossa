import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockBackendService } from '../../../utils';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

@Component({
    selector: 'app-trackingNumber-ditails',
    standalone: true,
    imports: [CommonModule, NotificationCardComponent],
    templateUrl: './admin-tracking-number-ditails-component.html',
    styleUrls: ['./admin-tracking-number-ditails-component.css']
})
export class AdminTrackingNumberDitailsComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly backend = inject(MockBackendService);
    private readonly notifications = inject(NotificationService);

    // Evita doppi click durante il salvataggio
    readonly isSubmitting = signal<boolean>(false);

    // Id del collo scelto nella lista (parametro :id del percorso)
    private readonly trackingId = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');

    // Il collo selezionato, dal servizio condiviso
    private readonly tracking = computed(() =>
        this.backend.trackingNumber().find(t => t.id === this.trackingId())
    );

    // Vero se la ricezione è già stata confermata
    readonly alreadyReceived = computed(() => this.tracking()?.status === 'Ricevuto');

    // Informazioni del collo (valori neutri se l'id non esiste)
    readonly colloInfo = computed(() => {
        const tracking = this.tracking();

        if (!tracking) {
            return { id: 'Sconosciuto', source: 'N/D', category: 'N/D', totalPackages: 0 };
        }

        return {
            id: tracking.code,
            source: this.backend.getSiteName(tracking.fromSiteId),
            category: tracking.category,
            totalPackages: tracking.quantity
        };
    });

    // Prodotti contenuti nel collo selezionato
    readonly products = computed(() =>
        (this.tracking()?.items ?? []).map(item => {
            // Data da YYYY-MM-DD a DD/MM/YYYY
            const [year, month, day] = item.expiry.split('-');
            return {
                id: item.lot,
                name: item.name,
                lot: item.lot,
                expiry: `${day}/${month}/${year}`,
                stock: item.quantity
            };
        })
    );

    goBack(): void {
        this.router.navigate(['/admin-tracking-number']);
    }

    /**
     * Conferma la ricezione: salva nei dati condivisi e SOLO dopo il salvataggio torna alla lista,
     * dove compare il banner. Se il salvataggio fallisce resta qui con un banner di errore.
     */
    async confirmReceipt(): Promise<void> {
        if (this.isSubmitting() || this.alreadyReceived()) return;

        this.isSubmitting.set(true);
        try {
            await this.backend.confirmTrackingReceipt(this.trackingId());
            // Il banner è nel servizio root: resta visibile nella pagina di destinazione
            this.notifications.success('Ricezione del collo confermata');
            await this.router.navigate(['/admin-tracking-number'], { replaceUrl: true });
        } catch {
            this.notifications.error('Errore durante la conferma della ricezione');
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
