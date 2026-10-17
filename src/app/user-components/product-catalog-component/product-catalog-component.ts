import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Product {
    id: string;
    name: string;
    icon: 'bag' | 'bottle' | 'meat';
    stock: number;
    expiry: string;
    price: number;
    quantity: number;
    expiryWarning?: boolean;
    outOfStock?: boolean;
    isRequested?: boolean;
}

@Component({
    selector: 'app-product-catalog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-catalog-component.html',
    styleUrls: ['./product-catalog-component.css']
})
export class ProductCatalogComponent {
    private readonly router = inject(Router);
    
    // --- SEZIONE VARIABILI E SEGNALI ---
    readonly beneficiaryName = signal('Mario Rossi');
    readonly initialTokens = signal(370); // Token di partenza
    readonly searchQuery = signal('');
    readonly selectedCategory = signal('Tutti');
    readonly categories = signal(['Tutti', 'Pasta', 'Omogeneizzati', 'Carne', 'Verdura']);

    readonly products = signal<Product[]>([
        { id: '1', name: 'Pasta di semola 500g', icon: 'bag', stock: 420, expiry: '15/05/2026', price: 2, quantity: 0 },
        { id: '2', name: 'Pasta integrale 500g', icon: 'bag', stock: 58, expiry: '02/11/2025', price: 3, quantity: 0, expiryWarning: true },
        { id: '3', name: 'Passata di pomodoro 700g', icon: 'bottle', stock: 300, expiry: '20/08/2026', price: 1, quantity: 0 },
        { id: '4', name: 'Petto di pollo 1kg', icon: 'meat', stock: 25, expiry: '30/10/2025', price: 5, quantity: 0, expiryWarning: true },
        { id: '5', name: 'Omogeneizzato carne', icon: 'bottle', stock: 0, expiry: '', price: 2, quantity: 0, outOfStock: true, isRequested: false }
    ]);

    // --- SEZIONE CALCOLI AUTOMATICI (COMPUTED) ---
    readonly usedTokens = computed(() =>
        this.products().reduce((acc, product) => acc + (product.quantity * product.price), 0)
    );

    readonly availableTokens = computed(() =>
        this.initialTokens() - this.usedTokens()
    );

    readonly totalItems = computed(() =>
        this.products().reduce((acc, product) => acc + product.quantity, 0)
    );

    // --- SEZIONE METODI ---
    goBack(): void {
        this.router.navigate(['/person-profile']);
    }

    setCategory(category: string): void {
        this.selectedCategory.set(category);
    }

    incrementQuantity(targetProduct: Product): void {
        if (targetProduct.outOfStock) return;
        
        // Controllo scorte in magazzino
        if (targetProduct.quantity >= targetProduct.stock) {
            console.warn(`Stock massimo raggiunto per ${targetProduct.name}`);
            return;
        }

        // Controllo disponibilità Token
        if (this.availableTokens() < targetProduct.price) {
            console.warn('Token insufficienti');
            return; 
        }

        this.updateProductQuantity(targetProduct.id, targetProduct.quantity + 1);
    }

    decrementQuantity(targetProduct: Product): void {
        if (targetProduct.quantity <= 0) return;
        this.updateProductQuantity(targetProduct.id, targetProduct.quantity - 1);
    }

    requestProduct(targetProduct: Product): void {
        if (!targetProduct.outOfStock || targetProduct.isRequested) return;
        this.products.update(currentProducts =>
            currentProducts.map(product =>
                product.id === targetProduct.id ? { ...product, isRequested: true } : product
            )
        );
    }

    goToSummary(): void {
        console.log(`Vai al riepilogo: ${this.totalItems()} articoli. Token residui: ${this.availableTokens()}`);
    }

    private updateProductQuantity(productId: string, newQuantity: number): void {
        this.products.update(currentProducts =>
            currentProducts.map(product =>
                product.id === productId ? { ...product, quantity: newQuantity } : product
            )
        );
    }
}