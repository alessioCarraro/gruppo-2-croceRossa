import { Injectable, computed, signal } from '@angular/core';

export interface CatalogProduct {
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

export interface Transaction {
    date: string;
    location: string;
    operator: string;
    type: string;
    itemsCount: number;
    tokensUsed: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartStateService {
    // --- Anagrafica e Profilo Utente ---
    readonly beneficiaryName = signal('Mario Rossi');
    readonly personInitials = signal('MR');
    readonly personId = signal('ID-2024-0481');
    readonly birthDate = signal('14/03/1982');
    readonly address = signal('Via Roma 24, Legnano (MI)');
    readonly personStatus = signal('Idoneo');
    readonly initialTokens = signal(575);

    readonly familyNucleus = signal({
        adults: { count: 2, tokensPerPerson: 250 },
        minors: { count: 1, tokensPerPerson: 75 }
    });

    readonly history = signal<Transaction[]>([
        {
            date: '03 ott',
            location: 'Negozio Legnano',
            operator: 'op. M. Turelli',
            type: 'Consegna',
            itemsCount: 3,
            tokensUsed: 95
        },
        {
            date: '14 set',
            location: 'Parabiago',
            operator: 'op. G. Carraro',
            type: 'Consegna',
            itemsCount: 2,
            tokensUsed: 60
        }
    ]);

    // --- Stato Prodotti e Carrello ---
    readonly products = signal<CatalogProduct[]>([
        { id: '1', name: 'Pasta di semola 500g', icon: 'bag', stock: 420, expiry: '15/05/2026', price: 2, quantity: 0 },
        { id: '2', name: 'Pasta integrale 500g', icon: 'bag', stock: 58, expiry: '02/11/2025', price: 3, quantity: 0, expiryWarning: true },
        { id: '3', name: 'Passata di pomodoro 700g', icon: 'bottle', stock: 300, expiry: '20/08/2026', price: 1, quantity: 0 },
        { id: '4', name: 'Petto di pollo 1kg', icon: 'meat', stock: 25, expiry: '30/10/2025', price: 5, quantity: 0, expiryWarning: true },
        { id: '5', name: 'Omogeneizzato carne', icon: 'bottle', stock: 0, expiry: '', price: 2, quantity: 0, outOfStock: true, isRequested: false }
    ]);

    // --- Valori Calcolati (Computed Signals) ---
    readonly usedTokens = computed(() =>
        this.products().reduce((acc, product) => acc + (product.quantity * product.price), 0)
    );

    // Manteniamo o aliasiamo le proprietà per retrocompatibilità
    readonly remainingTokens = computed(() =>
        this.initialTokens() - this.usedTokens()
    );
    readonly availableTokens = this.remainingTokens;

    readonly totalItems = computed(() =>
        this.products().reduce((acc, product) => acc + product.quantity, 0)
    );
    readonly totalItemsCount = this.totalItems;

    readonly selectedProducts = computed(() =>
        this.products().filter(product => product.quantity > 0)
    );

    // --- Metodi ---
    updateProductQuantity(productId: string, newQuantity: number): void {
        this.products.update(currentProducts =>
            currentProducts.map(product =>
                product.id === productId ? { ...product, quantity: newQuantity } : product
            )
        );
    }

    requestProduct(targetProduct: CatalogProduct): void {
        if (!targetProduct.outOfStock || targetProduct.isRequested) return;
        this.products.update(currentProducts =>
            currentProducts.map(product =>
                product.id === targetProduct.id ? { ...product, isRequested: true } : product
            )
        );
    }
}