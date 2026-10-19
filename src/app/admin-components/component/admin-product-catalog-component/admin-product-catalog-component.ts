import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface AdminProduct {
    id: string;
    name: string;
    icon: 'bag' | 'bottle' | 'meat';
    stock: number;
    expiry: string;
    price: number;
    quantity: number;
    expiryWarning?: boolean;
    outOfStock?: boolean;
    isOrdered?: boolean; // Rinominato da isRequested per il dominio Admin
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

    readonly beneficiaryName = signal('Mario Rossi');
    readonly availableTokens = signal(370);
    readonly searchQuery = signal('');
    readonly selectedCategory = signal('Tutti');
    readonly categories = signal(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Verdura']);

    readonly products = signal<AdminProduct[]>([
        { id: '1', name: 'Pasta di semola 500g', icon: 'bag', stock: 420, expiry: '15/05/2026', price: 20, quantity: 1 },
        { id: '2', name: 'Pasta integrale 500g', icon: 'bag', stock: 58, expiry: '02/11/2025', price: 22, quantity: 0, expiryWarning: true },
        { id: '3', name: 'Passata di pomodoro 700g', icon: 'bottle', stock: 300, expiry: '20/08/2026', price: 15, quantity: 2 },
        { id: '4', name: 'Petto di pollo 1kg', icon: 'meat', stock: 25, expiry: '30/10/2025', price: 40, quantity: 0, expiryWarning: true },
        { id: '5', name: 'Omogeneizzato carne', icon: 'bottle', stock: 0, expiry: '', price: 0, quantity: 0, outOfStock: true, isOrdered: false }
    ]);

    readonly totalItems = computed(() =>
        this.products().reduce((acc, product) => acc + product.quantity, 0)
    );

    goBack(): void {
        this.router.navigate(['/admin-profile']);
    }

    setCategory(category: string): void {
        this.selectedCategory.set(category);
    }

    incrementQuantity(targetProduct: AdminProduct): void {
        if (targetProduct.outOfStock) return;
        this.updateProductQuantity(targetProduct.id, targetProduct.quantity + 1);
    }

    decrementQuantity(targetProduct: AdminProduct): void {
        if (targetProduct.quantity <= 0) return;
        this.updateProductQuantity(targetProduct.id, targetProduct.quantity - 1);
    }

    // Metodo aggiornato per il dominio Admin
    orderProduct(targetProduct: AdminProduct): void {
        if (!targetProduct.outOfStock || targetProduct.isOrdered) return;
        this.products.update(currentProducts =>
            currentProducts.map(product =>
                product.id === targetProduct.id ? { ...product, isOrdered: true } : product
            )
        );
    }

    goToSummary(): void {
        this.router.navigate(['/admin-summary']);
    }

    private updateProductQuantity(productId: string, newQuantity: number): void {
        this.products.update(currentProducts =>
            currentProducts.map(product =>
                product.id === productId ? { ...product, quantity: newQuantity } : product
            )
        );
    }
}