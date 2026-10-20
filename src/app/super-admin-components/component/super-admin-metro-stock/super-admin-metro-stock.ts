import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils'; // <-- Verifica sempre il percorso corretto!

interface InventoryItem {
  id: string;
  name: string;
  stock: string;
  expiryDate: string;
  isExpiringSoon: boolean;
  tokenValue: number;
  iconType: 'bag' | 'bottle' | 'meat' | 'jar';
}

@Component({
  selector: 'app-super-admin-metro-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-metro-stock.html',
  styleUrls: ['./super-admin-metro-stock.css']
})
export class SuperAdminMetroStockComponent {
  private readonly router = inject(Router);
  private readonly backendService: MockBackendService = inject(MockBackendService);

  // Signal per la barra di ricerca testuale
  readonly searchQuery = signal<string>('');
  
  // Signal per la categoria attualmente selezionata
  readonly activeCategory = signal<string>('Tutti');

  // Categorie generate dai prodotti presenti nella metro (stessa fonte dell'Operator)
  readonly categories = computed<string[]>(() => {
    const uniqueCategories = new Set(this.backendService.metroStock().map(p => p.category));
    return ['Tutti', ...Array.from(uniqueCategories)];
  });

  // Lista prodotti filtrata in modo reattivo, dalle giacenze della metro (stessa fonte dell'Operator)
  readonly items = computed<InventoryItem[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.activeCategory();

    return this.backendService.metroStock()
      // 1. Filtro per categoria
      .filter(p => category === 'Tutti' || p.category === category)
      // 2. Filtro per testo (nome prodotto)
      .filter(p => !query || p.name.toLowerCase().includes(query))
      // 3. Mappatura nel formato richiesto dall'interfaccia HTML
      .map(p => {
        // Formattiamo la data YYYY-MM-DD in DD/MM/YYYY
        const dateParts = p.expiry.split('-');
        const formattedDate = dateParts.length === 3
          ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
          : p.expiry;

        return {
          id: p.productId,
          name: p.name,
          stock: p.stock.toLocaleString('it-IT'), // Es. formatta 3400 in "3.400"
          expiryDate: formattedDate,
          isExpiringSoon: p.isExpiringSoon,
          tokenValue: p.price, // Usiamo il prezzo come valore in token
          iconType: p.iconType
        };
      });
  });

  // Totale articoli: somma delle giacenze della metro (stesso numero mostrato all'Operator)
  readonly totalArticles = computed<string>(() => {
    return `${this.backendService.metroTotalStock().toLocaleString('it-IT')} art.`;
  });

  // Metodo richiamato ogni volta che l'utente digita nella barra di ricerca
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  // Cambio categoria dai bottoni "pill"
  selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  // Torna alla dashboard
  goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }

  editItem(item: InventoryItem): void {
    console.log('Modifica token per:', item.name);
    // In futuro potrai implementare un popup o una pagina per modificare le info del prodotto
  }
}