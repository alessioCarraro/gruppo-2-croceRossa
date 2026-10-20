import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RestockCartService } from '../../../services/restock-cart-service';

@Component({
  selector: 'app-super-admin-order-sent-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-order-sent-confirmation-component.html',
  styleUrls: ['./super-admin-order-sent-confirmation-component.css']
})
export class SuperAdminOrderSentConfirmationComponent {
  private readonly router = inject(Router);
  private readonly cart = inject(RestockCartService);

  // Dati dell'ultimo ordine inviato (salvati dalla pagina del carrello)
  public destinationStore = computed(() => this.cart.lastSent()?.siteName ?? '-');
  public totalProductsSent = computed(() => this.cart.lastSent()?.productCount ?? 0);

  // "Torna a Rifornitura sedi"
  public navigateToDashboard(): void {
    this.router.navigate(['/s-admin-restock'], { replaceUrl: true });
  }

  // "Torna alla dashboard"
  public startNewOrder(): void {
    this.router.navigate(['/s-admin-home'], { replaceUrl: true });
  }
}
