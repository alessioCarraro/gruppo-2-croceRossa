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

// Risultato della ricerca: un prodotto con le altre sedi in cui è disponibile
interface ProductAvailability {
    productId: string;
    productName: string;
    status: string;
    locations: StoreLocation[];
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

    // Testo cercato; se si arriva dalla home con un prodotto (?productId=...) parte già compilato
    public readonly searchQuery = signal<string>(
        this.backend.getProduct(this.route.snapshot.queryParamMap.get('productId') ?? '')?.name ?? ''
    );

    public onSearchInput(event: Event): void {
        this.searchQuery.set((event.target as HTMLInputElement).value);
    }

    /**
     * Prodotti che corrispondono alla ricerca, con le ALTRE sedi (diverse da quella dell'Admin)
     * che li hanno davvero in giacenza. Dati condivisi: catalogo e inventari delle sedi.
     * Il prodotto compare solo se almeno una sede ha giacenza maggiore di 0.
     */
    public readonly results = computed<ProductAvailability[]>(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return [];

        const mySiteId = this.backend.currentSite()?.id;
        const km = (distance: string) => parseFloat(distance.replace(',', '.'));

        return this.backend.products()
            .filter(product => product.name.toLowerCase().includes(query))
            .map(product => {
                const all = this.backend.getInventoriesForProduct(product.id);
                const own = all.find(l => l.siteId === mySiteId)?.stock ?? 0;

                const locations = all
                    .filter(l => l.siteId !== mySiteId && l.stock > 0)
                    .sort((a, b) => km(a.distance) - km(b.distance)) // dalla più vicina
                    .map((l, index) => ({ id: index + 1, name: l.siteName, availability: l.stock, distance: l.distance }));

                return {
                    productId: product.id,
                    productName: product.name,
                    status: own > 0 ? `${own} disponibili nella tua sede` : 'esaurito nella tua sede',
                    locations
                };
            })
            .filter(result => result.locations.length > 0);
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
