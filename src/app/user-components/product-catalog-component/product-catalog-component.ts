import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartStateService, CatalogProduct } from '../../services/user-services/cart-service';

@Component({
    selector: 'app-product-catalog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-catalog-component.html',
    styleUrls: ['./product-catalog-component.css']
})
export class ProductCatalogComponent {
    private readonly router = inject(Router);
    private readonly cartState = inject(CartStateService);
    
    readonly searchQuery = signal('');
    readonly selectedCategory = signal('Tutti');
    readonly categories = signal(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Verdura']);

    // Expose state and computed properties from the service
    readonly beneficiaryName = this.cartState.beneficiaryName;
    readonly initialTokens = this.cartState.initialTokens;
    readonly products = this.cartState.products;
    readonly availableTokens = this.cartState.availableTokens;
    readonly totalItems = this.cartState.totalItems;

    goBack(): void {
        this.router.navigate(['/person-profile']);
    }

    setCategory(category: string): void {
        this.selectedCategory.set(category);
    }

    incrementQuantity(targetProduct: CatalogProduct): void {
        if (targetProduct.outOfStock) return;
        
        if (targetProduct.quantity >= targetProduct.stock) {
            console.warn(`Stock massimo raggiunto per ${targetProduct.name}`);
            return;
        }

        if (this.availableTokens() < targetProduct.price) {
            console.warn('Token insufficienti');
            return; 
        }

        this.cartState.updateProductQuantity(targetProduct.id, targetProduct.quantity + 1);
    }

    decrementQuantity(targetProduct: CatalogProduct): void {
        if (targetProduct.quantity <= 0) return;
        this.cartState.updateProductQuantity(targetProduct.id, targetProduct.quantity - 1);
    }

    requestProduct(targetProduct: CatalogProduct): void {
        this.cartState.requestProduct(targetProduct);
    }

    goToSummary(): void {
        this.router.navigate(['/summary']);
    }
}