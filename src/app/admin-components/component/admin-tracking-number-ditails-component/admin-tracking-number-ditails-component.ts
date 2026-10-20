import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockBackendService } from '../../../utils';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-trackingNumber-ditails',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-tracking-number-ditails-component.html',
    styleUrls: ['./admin-tracking-number-ditails-component.css']
})
export class AdminTrackingNumberDitailsComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly backend = inject(MockBackendService);

    // Id del collo scelto nella lista (parametro :id del percorso)
    private readonly trackingId = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');

    // Il collo selezionato, dal servizio condiviso
    private readonly tracking = computed(() =>
        this.backend.trackingNumber().find(t => t.id === this.trackingId())
    );

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

    confirmReceipt(): void {
        this.router.navigate(['/admin-tracking-number']);
    }
}
