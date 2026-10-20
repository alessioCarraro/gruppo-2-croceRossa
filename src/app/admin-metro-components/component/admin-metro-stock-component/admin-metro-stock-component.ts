import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MockBackendService } from '../../../utils';

interface InventoryItem {
  id: string;
  icon: string;
  name: string;
  category: string;
  stock: number;
  expiryDate: string;
  quantity: number;
  isExpiringSoon: boolean;
}

@Component({
  selector: 'app-admin-metro-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-stock-component.html',
  styleUrls: ['./admin-metro-stock-component.css']
})
export class AdminMetroStockComponent {
  // Iniezione del servizio Location per la navigazione nella history
  private readonly location = inject(Location);
  // Servizio con i dati dell'inventario delle sedi
  private readonly backend = inject(MockBackendService);

  // Testo scritto nella barra di ricerca e filtro categoria attivo
  public searchQuery = signal<string>('');
  public activeFilter = signal<string>('Tutti');

  /**
   * Articoli presenti nella metro: stessa fonte del Super Admin (MockBackendService.metroStock).
   * Si aggiorna da solo quando cambia l'inventario nel servizio.
   */
  public inventoryItems = computed<InventoryItem[]>(() =>
    this.backend.metroStock().map(item => ({
      id: item.productId,
      icon: item.icon,
      name: item.name,
      category: item.category,
      stock: item.stock,
      expiryDate: this.formatDate(item.expiry),
      quantity: item.stock,
      isExpiringSoon: item.isExpiringSoon
    }))
  );

  // Chip dei filtri: "Tutti" + le categorie davvero presenti nella metro
  public filters = computed<string[]>(() => [
    'Tutti',
    ...new Set(this.inventoryItems().map(item => item.category))
  ]);

  /**
   * Elenco mostrato in tabella: applica ricerca per nome e filtro categoria.
   * Si ricalcola in tempo reale a ogni cambio di testo o di filtro.
   */
  public filteredItems = computed<InventoryItem[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();

    return this.inventoryItems().filter(item =>
      (filter === 'Tutti' || item.category === filter) &&
      item.name.toLowerCase().includes(query)
    );
  });

  // Totale giacenza: somma delle quantità di tutti i prodotti della metro (0 se la lista è vuota).
  // Non dipende da ricerca e filtri: conta sempre l'intero inventario della metro.
  public totalItems = computed<number>(() =>
    this.inventoryItems().reduce((totale, item) => totale + item.stock, 0)
  );

  public updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  public selectFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  // Converte 'YYYY-MM-DD' in 'GG/MM/AAAA'
  private formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  /**
   * Riporta l'utente alla schermata precedente (Dashboard)
   */
  public goBack(): void {
    this.location.back();
  }
}
