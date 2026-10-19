import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RestockCartService } from '../../../services/restock-cart-service';

@Component({
  selector: 'app-admin-metro-request-sent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-request-sent-component.html',
  styleUrls: ['./admin-metro-request-sent-component.css']
})
export class AdminMetroRequestSentComponent {
  private readonly router = inject(Router);
  private readonly cart = inject(RestockCartService);

  // Dati dell'ultima richiesta inviata (salvati dalla pagina di riepilogo)
  public destinationStore = computed(() => this.cart.lastSent()?.siteName ?? '-');
  public totalProductsSent = computed(() => this.cart.lastSent()?.productCount ?? 0);

  // "Torna a Rifornitura sedi"
  public navigateToDashboard(): void {
    this.router.navigate(['/user-metro-restock'], { replaceUrl: true });
  }

  // "Torna alla dashboard"
  public startNewOrder(): void {
    this.router.navigate(['/user-metro-dashboard'], { replaceUrl: true });
  }
}
