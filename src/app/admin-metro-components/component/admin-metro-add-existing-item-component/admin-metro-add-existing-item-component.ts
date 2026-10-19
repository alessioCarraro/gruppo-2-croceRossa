import { Component, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

@Component({
  selector: 'app-admin-metro-add-existing-item',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './admin-metro-add-existing-item-component.html',
  styleUrls: ['./admin-metro-add-existing-item-component.css']
})
export class AdminMetroAddExistingItemComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly backend = inject(MockBackendService);
  private readonly notifications = inject(NotificationService);

  // Id del prodotto scelto nella pagina "Aggiungi carico"
  private productId: string | null = null;

  public macroCategory = signal<string>('Alimentari');
  public category = signal<string>('Legumi');
  public productType = signal<string>('Ceci in lattina 400g');
  public expiryDate = signal<string>('');
  public quantity = signal<string>('0');

  // Messaggio di errore di validazione (vuoto = nessun errore)
  public quantityError = signal<string>('');
  // Evita doppi click mentre il salvataggio è in corso
  public isSaving = signal<boolean>(false);

  constructor() {
    // Prodotto scelto nella pagina "Aggiungi carico" (?productId=...)
    this.productId = this.route.snapshot.queryParamMap.get('productId');
    const product = this.productId ? this.backend.getProduct(this.productId) : undefined;

    // Precompila i campi con i dati del prodotto selezionato
    if (product) {
      this.category.set(product.category);
      this.productType.set(product.name);
    }
  }

  public updateExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.expiryDate.set(input.value);
  }

  public updateQuantity(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantity.set(input.value);
    this.quantityError.set(''); // l'utente sta correggendo: toglie l'errore
  }

  /**
   * Pulsante indietro: torna alla pagina precedente ("Aggiungi carico").
   * Non salva nulla.
   */
  public goBack(): void {
    this.location.back();
  }

  /**
   * Salva la quantità: la aggiunge alla giacenza del prodotto in metro,
   * mostra la card di conferma e torna a "Aggiungi carico".
   */
  public async saveLoad(): Promise<void> {
    if (this.isSaving()) return;

    // Validazione: la quantità deve essere un numero intero maggiore di zero
    const raw = this.quantity().trim();
    const quantity = Number(raw);
    if (raw === '' || !Number.isInteger(quantity) || quantity <= 0) {
      this.quantityError.set('Inserisci una quantità valida (numero intero maggiore di 0)');
      return; // nessun salvataggio e nessun reindirizzamento
    }

    this.isSaving.set(true);
    try {
      if (!this.productId) {
        throw new Error('Nessun prodotto selezionato');
      }
      // Salvataggio reale nel servizio usato dall'inventario
      await this.backend.addStockToMetro(this.productId, quantity);

      // La card è nel servizio root: resta visibile anche dopo il cambio pagina
      this.notifications.success('Carico salvato correttamente');
      // replaceUrl: sostituisce questa pagina nella cronologia, così non resta tra le pagine "indietro"
      await this.router.navigate(['/user-metro-load-item'], { replaceUrl: true });
    } catch {
      this.notifications.error('Errore durante il salvataggio del carico');
    } finally {
      this.isSaving.set(false);
    }
  }
}
