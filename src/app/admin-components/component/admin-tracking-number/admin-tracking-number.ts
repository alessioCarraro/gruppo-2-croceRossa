import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SEED_SITES, SEED_TRACKING_NUMBER, Site, TrackingNumber } from '../../../utils';

@Component({
    selector: 'app-admin-tracking-number',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-tracking-number.html',
    styleUrls: ['./admin-tracking-number.css']
})
export class AdminTrackingNumberComponent {
    private readonly router = inject(Router);

    private readonly trackingNumberList = signal<TrackingNumber[]>(SEED_TRACKING_NUMBER);
    private readonly siteList = signal<Site[]>(SEED_SITES);

    getFromSiteIdName(siteId: string): string {
        const site = this.siteList().find(s => s.id === siteId);
        return site ? site.name : "Ente sconosciuto";
    }

    readonly totalColli = signal<number>(5);

    goBack(): void {
        this.router.navigate(['/admin-home']);
    }

    navigateToDetail(trackingId: string): void {
        this.router.navigate(['/admin-tracking-number-detail', trackingId]);
    }
}
