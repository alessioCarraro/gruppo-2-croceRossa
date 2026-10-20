import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, SEED_PRODUCTS, SEED_TRACKING_NUMBER } from '../../../utils';
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

    // Estrazione sicura dell'ID del tracking dai parametri della rotta
    private readonly trackingId = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');

    // Derivazione reattiva delle informazioni del collo tramite computed signal
    readonly colloInfo = computed(() => {
        const tracking = SEED_TRACKING_NUMBER.find(t => t.id === this.trackingId());

        if (!tracking) {
            return {
                id: 'Sconosciuto',
                source: 'N/D',
                category: 'N/D',
                totalPackages: 0
            };
        }

        return {
            id: tracking.code,
            source: tracking.fromSiteId,
            category: tracking.category,
            totalPackages: tracking.quantity
        };
    });

    // Stato reattivo per l'elenco dei prodotti associati al collo
    readonly products = signal<Product[]>(SEED_PRODUCTS);

    goBack(): void {
        this.router.navigate(['/admin-tracking-number']);
    }

    confirmReceipt(): void {
        this.router.navigate(['/admin-tracking-number']);
    }
}
