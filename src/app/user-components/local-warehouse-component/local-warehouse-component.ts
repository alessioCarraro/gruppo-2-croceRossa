import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductCategory, SEED_PRODUCTS } from '../../utils';
import { Router } from '@angular/router';

@Component({
    selector: 'app-warehouse-component',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './local-warehouse-component.html',
    styleUrls: ['./local-warehouse-component.css']
})
export class LocalWarehouseComponent {
    private readonly router = inject(Router);
    
    public readonly pageTitle = signal<string>('Magazzino');
    public readonly totalArticles = signal<string>('1.284 art.');
    readonly products = signal<Product[]>(SEED_PRODUCTS);
    readonly searchQry = signal<string>('');
    readonly selectedCategory = signal<ProductCategory | 'ALL'>('ALL');

    // Traccia gli ID dei prodotti per cui è stata fatta la richiesta (senza toccare lo stock)
    readonly requestedProductIds = signal<Set<string>>(new Set<string>());

    public readonly filteredProducts = computed(() => {
        const query = this.searchQry().toLocaleLowerCase();
        const category = this.selectedCategory();

        return this.products().filter(product => {
            const matchesQry = product.name.toLocaleLowerCase().includes(query);
            const matchesCategory = category === 'ALL' || product.category === category;
            return matchesQry && matchesCategory;
        });
    });

    toggleRestockRequest(productId: string): void {
        this.requestedProductIds.update(currentRequests => {
            const updatedRequests = new Set(currentRequests);
            if (updatedRequests.has(productId)) {
                updatedRequests.delete(productId);
            } else {
                updatedRequests.add(productId);
            }
            return updatedRequests;
        });
    }

    isRequested(productId: string): boolean {
        return this.requestedProductIds().has(productId);
    }

    setSearchQry(query: string): void {
        this.searchQry.set(query);
    }

    setCategory(category: ProductCategory | 'ALL'): void {
        this.selectedCategory.set(category);
    }

    public goBack(): void {
        this.router.navigate(['/user-home']);
    }
}