import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';
import { MockBackendService } from '../../../utils';

interface StockOption {
  id: string;
  title: string;
  description: string;
  icon: 'box' | 'plus';
}

interface SearchResult {
  id: string;
  name: string;
  weight: string;
}

@Component({
  selector: 'app-admin-metro-load-item',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './admin-metro-load-item-component.html',
  styleUrls: ['./admin-metro-load-item-component.css']
})
export class AdminMetroLoadItemComponent {
  // Iniezione del servizio Location per gestire la navigazione indietro
  private readonly location = inject(Location);
  // Router per aprire le pagine di carico
  private readonly router = inject(Router);

  // Servizio con i dati dell'inventario delle sedi
  private readonly backend = inject(MockBackendService);

  public searchQuery = signal<string>('');

  /**
   * Prodotti presenti nella metro: è l'unica fonte dei dati per la ricerca,
   * quindi un prodotto non presente in metro non può mai comparire nei risultati.
   */
  private readonly metroProducts = computed<SearchResult[]>(() => {
    const metro = this.backend.sites().find(s => s.type === 'Metro');
    if (!metro) return [];

    return this.backend.inventories()
      .filter(inv => inv.siteId === metro.id)
      .map(inv => ({
        id: inv.productId,
        // Stesso nome usato nella pagina Inventario (catalogo)
        name: this.backend.getProduct(inv.productId)?.name ?? inv.productName,
        weight: inv.weight
      }));
  });

  // Risultati della ricerca: cerca per nome solo tra i prodotti della metro
  public searchResults = computed<SearchResult[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    return this.metroProducts().filter(p => p.name.toLowerCase().includes(query));
  });

  public stockOptions = signal<StockOption[]>([
    {
      id: '1',
      title: 'Prodotto non ancora registrato',
      description: 'nuovo prodotto · valuta token · conferma superadmin',
      icon: 'plus'
    }
  ]);

  public updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    // I risultati si aggiornano da soli (computed)
    this.searchQuery.set(input.value);
  }

  /**
   * Pulsante "+": apre la pagina del carico per il prodotto scelto.
   * L'id del prodotto viene passato come query param (?productId=...).
   */
  public addToStock(result: SearchResult): void {
    console.info('Aggiunto al magazzino:', result.name);
    this.router.navigate(['/user-metro-add-existing-item'], { queryParams: { productId: result.id } });
  }

  /**
   * "Prodotto non ancora registrato": apre la pagina di nuovo prodotto.
   * Funziona sempre, senza dover selezionare prima un prodotto.
   */
  public openNewItem(): void {
    this.router.navigate(['/user-metro-add-new-item']);
  }

  /**
   * Indietro: porta sempre alla Dashboard, anche dopo un salvataggio
   * (la cronologia del browser può contenere altre pagine di carico).
   */
  public goBack(): void {
    this.router.navigate(['/user-metro-dashboard']);
  }
}