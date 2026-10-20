import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

@Component({
    selector: 'app-admin-tracking-number',
    standalone: true,
    imports: [CommonModule, NotificationCardComponent],
    templateUrl: './admin-tracking-number.html',
    styleUrls: ['./admin-tracking-number.css']
})
export class AdminTrackingNumberComponent {
    private readonly router = inject(Router);
    private readonly backend = inject(MockBackendService);

    // Colli ancora da ricevere, dal servizio condiviso (stessa fonte del dettaglio e del contatore)
    readonly trackingNumberList = this.backend.pendingTrackingNumbers;

    getFromSiteIdName(siteId: string): string {
        return this.backend.getSiteName(siteId);
    }

    // Numero reale di colli rimasti da ricevere
    readonly totalColli = computed<number>(() => this.trackingNumberList().length);

    goBack(): void {
        this.router.navigate(['/admin-home']);
    }

    // Apre il dettaglio del collo scelto (l'id viaggia nel percorso)
    navigateToDetail(trackingId: string): void {
        this.router.navigate(['/admin-tracking-number-detail', trackingId]);
    }
}
