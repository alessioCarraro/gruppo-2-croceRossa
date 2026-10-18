import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartStateService } from '../../services/user-services/cart-service';

interface SummaryItem {
    label: string;
    value: string | number;
    highlight?: boolean;
}

@Component({
    selector: 'app-delivery-success',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delivery-success-component.html',
    styleUrls: ['./delivery-success-component.css']
})
export class DeliverySuccessComponent {
    private readonly router = inject(Router);
    private readonly cartState = inject(CartStateService);

    readonly pageTitle = signal('Consegna completata');
    readonly pageSubtitle = signal('L’operazione è stata registrata con successo nel sistema.');

    // Mappa reattivamente i dati dinamici presi dal servizio condiviso
    readonly summaryDetails = computed<SummaryItem[]>(() => [
        { 
            label: 'Beneficiario', 
            value: this.cartState.beneficiaryName() 
        },
        { 
            label: 'Prodotti consegnati', 
            value: `${this.cartState.totalItemsCount()}` 
        },
        { 
            label: 'Token utilizzati', 
            value: `${this.cartState.usedTokens()} T` 
        },
        { 
            label: 'Token residui', 
            value: `${this.cartState.remainingTokens()} T`, 
            highlight: true 
        },
        { 
            label: 'Token totali', 
            value: `${this.cartState.initialTokens()} T` 
        }
    ]);

    navigateToDashboard(): void {
        this.router.navigate(['/user-home']);
    }
}