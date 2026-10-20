import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface StoreLocation {
    id: number;
    name: string;
    availability: number;
    distance: string;
}

@Component({
    selector: 'app-admin-store-locator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-stor-locator-component.html',
    styleUrls: ['./admin-stor-locator-component.css']
})
export class AdminStoreLocatorComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly backend = inject(MockBackendService);

    // Prodotto scelto nella home (?productId=...). Senza prodotto resta l'esempio statico di prima.
    private readonly product = this.backend.getProduct(this.route.snapshot.queryParamMap.get('productId') ?? '');

    public readonly searchQuery = signal<string>(this.product?.name ?? 'Pannolini taglia 4');
    public readonly productName = signal<string>(this.product?.name ?? 'Pannolini taglia 4');

    // Con un prodotto scelto: giacenza nella sede dell'Admin (dati condivisi)
    public readonly productStatus = computed<string>(() => {
        if (!this.product) return 'esaurito nella tua sede';
        const mySiteId = this.backend.currentSite()?.id;
        const own = this.backend.getInventoriesForProduct(this.product.id).find(l => l.siteId === mySiteId)?.stock ?? 0;
        return own > 0 ? `${own} disponibili nella tua sede` : 'esaurito nella tua sede';
    });

    private readonly exampleLocations: StoreLocation[] = [
        { id: 1, name: 'Parabiago', availability: 120, distance: '4,2 km' },
        { id: 2, name: 'S. Vittore Olona', availability: 80, distance: '5,1 km' },
        { id: 3, name: 'Canegrate', availability: 25, distance: '6,0 km' },
        { id: 4, name: 'Busto Garolfo', availability: 0, distance: '7,8 km' }
    ];

    // Con un prodotto scelto: disponibilità nelle altre sedi, dalla più vicina (dati condivisi)
    public readonly locations = computed<StoreLocation[]>(() => {
        if (!this.product) return this.exampleLocations;
        const mySiteId = this.backend.currentSite()?.id;
        const km = (d: string) => parseFloat(d.replace(',', '.'));

        return this.backend.getInventoriesForProduct(this.product.id)
            .filter(l => l.siteId !== mySiteId)
            .sort((x, y) => km(x.distance) - km(y.distance))
            .map((l, i) => ({ id: i + 1, name: l.siteName, availability: l.stock, distance: l.distance }));
    });

    public goBack(): void {
        this.router.navigate(['/admin-home'])
    }

    public getAvailabilityColor(availability: number): string {
        if (availability >= 80) return 'text-green';
        if (availability > 0) return 'text-orange';
        return 'text-grey';
    }
}
