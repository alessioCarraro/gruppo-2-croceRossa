import { Component, signal, computed, inject } from '@angular/core';
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
  public productId = signal<string | null>(null);

  public macroCategory = signal<string>('Alimentari');
  public category = signal<string>('Legumi');
  public productType = signal<string>('Ceci in lattina 400g');
  public expiryDate = signal<string>('');
  public quantity = signal<string>('');

  // Giacenza totale del prodotto selezionato (0 se non c'è giacenza o il prodotto non è noto).
  // Si aggiorna da sola quando cambia il prodotto o la giacenza.
  public currentStock = computed<number>(() => {
    const id = this.productId();
    return id ? (this.backend.getProduct(id)?.stock ?? 0) : 0;
  });

  // Diventa true dopo il primo tentativo di salvataggio: da quel momento compaiono gli avvisi
  public submitted = signal<boolean>(false);

  // Avvisi vicino ai campi mancanti (stessa logica della pagina super-admin)
  public quantityError = computed<string>(() => {
    if (!this.submitted()) return '';
    const raw = this.quantity().trim();
    if (raw === '' || Number(raw) === 0) return 'Inserisci la quantità';
    if (!Number.isInteger(Number(raw)) || Number(raw) < 0) return 'Inserisci una quantità valida (intero maggiore di 0)';
    return '';
  });
  public expiryError = computed<string>(() =>
    this.submitted() && this.expiryDate() === '' ? 'Inserisci la data di scadenza' : ''
  );
  // Evita doppi click mentre il salvataggio è in corso
  public isSaving = signal<boolean>(false);

  constructor() {
    // Prodotto scelto nella pagina "Aggiungi carico" (?productId=...)
    this.productId.set(this.route.snapshot.queryParamMap.get('productId'));
    const product = this.productId() ? this.backend.getProduct(this.productId()!) : undefined;

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

    // Il pulsante è sempre premibile: se mancano quantità o scadenza mostra gli avvisi
    // e non salva né reindirizza
    this.submitted.set(true);
    if (this.quantityError() || this.expiryError()) return;
    const quantity = Number(this.quantity());

    this.isSaving.set(true);
    try {
      const productId = this.productId();
      if (!productId) {
        throw new Error('Nessun prodotto selezionato');
      }
      // Salvataggio reale nel servizio usato dall'inventario
      await this.backend.addStockToMetro(productId, quantity);

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
