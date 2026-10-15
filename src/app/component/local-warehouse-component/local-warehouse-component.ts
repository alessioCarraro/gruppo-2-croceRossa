import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CategoryFilter {
  id: string;
  label: string;
  selected: boolean;
}

interface CatalogItem {
  id: string;
  name: string;
  weight?: string;
  stock: number;
  expirationDate?: string;
  isExpiringSoon?: boolean;
  tokenCost: number;
  iconType: 'bag' | 'meat' | 'jar';
}

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './local-warehouse-component.html',
  styleUrls: ['./local-warehouse-component.css']
})
export class LocalWarehouseComponent {
  // Stato Globale della Schermata
  public readonly pageTitle = signal<string>('Magazzino');
  public readonly totalArticles = signal<string>('1.284 art.');

  // Filtri di Categoria
  public readonly filters = signal<CategoryFilter[]>([
    { id: 'all', label: 'Tutti', selected: true },
    { id: 'pasta', label: 'Pasta', selected: false },
    { id: 'baby-food', label: 'Omogeneizzati', selected: false },
    { id: 'meat', label: 'Carne', selected: false }
  ]);

  // Catalogo Prodotti
  public readonly catalog = signal<CatalogItem[]>([
    {
      id: '1',
      name: 'Pasta di semola',
      weight: '500g',
      stock: 420,
      expirationDate: '15/05/2026',
      tokenCost: 20,
      iconType: 'bag'
    },
    {
      id: '2',
      name: 'Pasta integrale',
      weight: '500g',
      stock: 58,
      expirationDate: '02/11/2025',
      isExpiringSoon: true,
      tokenCost: 22,
      iconType: 'bag'
    },
    {
      id: '3',
      name: 'Petto di pollo',
      weight: '1kg',
      stock: 25,
      expirationDate: '30/10/2025',
      isExpiringSoon: true,
      tokenCost: 40,
      iconType: 'meat'
    },
    {
      id: '4',
      name: 'Omogeneizzato carne',
      stock: 0, // 0 indica "Esaurito"
      tokenCost: 30,
      iconType: 'jar'
    }
  ]);

  // Azioni
  public goBack(): void {
    console.log('Navigazione: Indietro');
  }

  public selectFilter(filterId: string): void {
    this.filters.update(currentFilters =>
      currentFilters.map(f => ({ ...f, selected: f.id === filterId }))
    );
  }

  public restockItem(item: CatalogItem): void {
    console.log(`Richiesta restock per: ${item.name}`);
  }
}