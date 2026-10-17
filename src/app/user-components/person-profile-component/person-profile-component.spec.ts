import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartStateService } from '../../services/user-services/cart-service';

@Component({
    selector: 'app-person-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './person-profile-component.html',
    styleUrls: ['./person-profile-component.css']
})
export class PersonProfileComponent {
    private readonly router = inject(Router);
    private readonly cartState = inject(CartStateService);

    readonly personDetails = computed(() => ({
        initials: this.cartState.personInitials(),
        name: this.cartState.beneficiaryName(),
        id: this.cartState.personId(),
        birthDate: this.cartState.birthDate(),
        address: this.cartState.address(),
        status: this.cartState.personStatus(),
        currentTokens: this.cartState.remainingTokens(),
        maxTokens: this.cartState.initialTokens()
    }));

    readonly familyNucleus = this.cartState.familyNucleus;
    readonly history = this.cartState.history;

    goBack(): void {
        this.router.navigate(['/home']);
    }

    startDelivery(): void {
        this.router.navigate(['/product-catalog']);
    }
}