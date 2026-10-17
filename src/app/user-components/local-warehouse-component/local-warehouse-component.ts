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
    // Stato Globale della Schermata
    private readonly router = inject(Router);
    public readonly pageTitle = signal<string>('Magazzino');
    public readonly totalArticles = signal<string>('1.284 art.');
    readonly products = signal<Product[]>(SEED_PRODUCTS);
    readonly searchQry = signal<string>('');
    readonly selectedCategory = signal<ProductCategory | 'ALL'>('ALL');

    // Filtri di Categoria
    public readonly filteredProducts = computed(() => {
        const query = this.searchQry().toLocaleLowerCase();
        const category = this.selectedCategory();

        return this.products().filter(product => {
            const matchesQry = product.name.toLocaleLowerCase().includes(query);
            const matchesCategory = category === 'ALL' || product.category === category;
            return matchesQry && matchesCategory;
        });
    });

    updateStock(productId: string, quantityChange: number): void {
        this.products.update(currentProducts =>
            currentProducts.map(product => {
                if (product.id === productId) {
                    const newStock = Math.max(0, product.stock + quantityChange);
                    return { ...product, stock: newStock};
                }
                return product;
            })
        );
    }

    setSearchQry(query: string): void {
        this.searchQry.set(query)
    }

    setCategory(category: ProductCategory | 'ALL'): void {
        this.selectedCategory.set(category);
    }

    // Azioni
    public goBack(): void {
       this.router.navigate(['/home']);
    }

    // public selectFilter(filterId: string): void {
    //     this.filters.update(currentFilters =>
    //         currentFilters.map(f => ({ ...f, selected: f.id === filterId }))
    //     );
    // }

    // public restockItem(item: CatalogItem): void {
    //     console.log(`Richiesta restock per: ${item.name}`);
    // }
}