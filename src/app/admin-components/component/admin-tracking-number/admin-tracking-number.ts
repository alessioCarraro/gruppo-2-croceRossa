import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

@Component({
    selector: 'app-admin-tracking-number',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-tracking-number.html',
    styleUrls: ['./admin-tracking-number.css']
})
export class AdminTrackingNumberComponent {
    private readonly router = inject(Router);
    private readonly backend = inject(MockBackendService);

    // Colli dal servizio condiviso (stessa fonte del dettaglio)
    readonly trackingNumberList = this.backend.trackingNumber;

    getFromSiteIdName(siteId: string): string {
        return this.backend.getSiteName(siteId);
    }

    // Numero reale di colli in elenco
    readonly totalColli = computed<number>(() => this.trackingNumberList().length);

    goBack(): void {
        this.router.navigate(['/admin-home']);
    }

    // Apre il dettaglio del collo scelto (l'id viaggia nel percorso)
    navigateToDetail(trackingId: string): void {
        this.router.navigate(['/admin-tracking-number-detail', trackingId]);
    }
}
