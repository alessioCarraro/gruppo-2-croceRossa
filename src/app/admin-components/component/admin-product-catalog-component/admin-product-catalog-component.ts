import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminDeliveryService, DeliveryProduct } from '../../../services/admin-delivery-service';
import { AdminOrderService } from '../../../services/admin-order-service';
import { MockBackendService } from '../../../utils';

// Prodotto mostrato in lista: dati della sede + quantità scelta
export interface AdminProduct extends DeliveryProduct {
    quantity: number;
    isOrdered: boolean;
}

@Component({
    selector: 'app-admin-product-catalog', // Selettore aggiornato
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-product-catalog-component.html', // Percorso aggiornato
    styleUrls: ['./admin-product-catalog-component.css'] // Percorso aggiornato
})
export class AdminProductCatalogComponent {
    private readonly router = inject(Router);
    private readonly delivery = inject(AdminDeliveryService);
    private readonly order = inject(AdminOrderService);
    private readonly backend = inject(MockBackendService);

    // Beneficiario della consegna (scelto nella scheda persona)
    readonly beneficiaryName = computed(() => {
        const b = this.delivery.beneficiary();
        return b ? `${b.firstName} ${b.lastName}` : 'Nessun beneficiario';
    });

    // Token residui PREVISTI = saldo - token della selezione. Non vengono scalati finché non si conferma.
    readonly availableTokens = this.delivery.remainingTokens;

    readonly searchQuery = signal('');
    readonly selectedCategory = signal('Tutti');
    readonly categories = signal(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Verdura']);

    /**
     * Prodotti della sede con ricerca e filtro usati insieme.
     * La selezione vive nel servizio: cambiare ricerca o filtro non la cancella.
     */
    readonly products = computed<AdminProduct[]>(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const category = this.selectedCategory();

        return this.delivery.catalog()
            .filter(p => category === 'Tutti' || p.category === category)
            .filter(p => !query || p.name.toLowerCase().includes(query))
            .map(p => ({ ...p, quantity: this.delivery.quantityOf(p.id), isOrdered: this.order.has(p.id) }));
    });

    // Numero totale di pezzi selezionati (su tutti i prodotti, anche quelli non visibili)
    readonly totalItems = this.delivery.totalUnits;

    goBack(): void {
        // Torna alla scheda dello stesso beneficiario
        this.router.navigate(['/admin-profile'], { queryParams: { id: this.delivery.beneficiary()?.id } });
    }

    setCategory(category: string): void {
        this.selectedCategory.set(category);
    }

    // Si può aumentare solo entro giacenza e saldo token
    canIncrement(product: AdminProduct): boolean {
        return this.delivery.canIncrement(product.id);
    }

    incrementQuantity(targetProduct: AdminProduct): void {
        this.delivery.increment(targetProduct.id);
    }

    decrementQuantity(targetProduct: AdminProduct): void {
        this.delivery.decrement(targetProduct.id);
    }

    // Prodotto esaurito: lo aggiunge all'ordine al magazzino centrale (stessa bozza della pagina Magazzino)
    orderProduct(targetProduct: AdminProduct): void {
        if (!targetProduct.outOfStock || targetProduct.isOrdered) return;
        this.order.add({
            productId: targetProduct.id,
            name: targetProduct.name,
            description: 'Esaurito',
            quantity: Math.max(1, this.backend.getProduct(targetProduct.id)?.minStock ?? 10)
        });
    }

    goToSummary(): void {
        this.router.navigate(['/admin-summary']);
    }
}
