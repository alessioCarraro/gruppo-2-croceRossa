import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartStateService, CatalogProduct } from '../../services/user-services/cart-service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-component.html',
  styleUrls: ['./summary-component.css']
})
export class SummaryComponent {
  private readonly router = inject(Router);
  private readonly cartState = inject(CartStateService);

  readonly products = this.cartState.selectedProducts;
  readonly totalTokensUsed = this.cartState.usedTokens;
  readonly beneficiaryName = this.cartState.beneficiaryName;
  readonly remainingTokens = this.cartState.availableTokens;

  public incrementQuantity(productId: string): void {
    const product = this.cartState.products().find(p => p.id === productId);
    if (product) {
      this.cartState.updateProductQuantity(productId, product.quantity + 1);
    }
  }

  public decrementQuantity(productId: string): void {
    const product = this.cartState.products().find(p => p.id === productId);
    if (product && product.quantity > 0) {
      this.cartState.updateProductQuantity(productId, product.quantity - 1);
    }
  }

  public goBack(): void {
    this.router.navigate(['/product-catalog']);
  }

  public confirmDelivery(): void {
    console.log('Consegna confermata. Token utilizzati:', this.totalTokensUsed());
  }
}