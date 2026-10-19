import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils'; // <-- Controlla il percorso

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
  selector: 'app-super-admin-load-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-load-item-component.html',
  styleUrls: ['./super-admin-load-item-component.css']
})
export class SuperAdminLoadItemComponent {
  private readonly router = inject(Router);
  private readonly backendService: MockBackendService = inject(MockBackendService);

  // Parte vuoto in modo da non mostrare risultati fino a quando l'utente non digita
  public searchQuery = signal<string>('');

  // Sostituiamo il singolo risultato finto con un computed che filtra i prodotti reali dal service
  public searchResults = computed<SearchResult[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    
    // Se la barra è vuota o ha meno di 2 caratteri, non mostriamo suggerimenti
    if (query.length < 2) {
      return [];
    }

    const products = this.backendService.products();
    
    // Filtra i prodotti del catalogo e mappa solo le info che ci servono
    return products
      .filter(p => p.name.toLowerCase().includes(query))
      .map(p => ({
        id: p.id,
        name: p.name,
        weight: p.unit // Usiamo il campo unit (es. 'Kg', 'Pacco') come peso/unità
      }));
  });

  public stockOptions = signal<StockOption[]>([
    {
      id: '1',
      title: 'Prodotto non ancora registrato',
      description: 'Registra un nuovo prodotto',
      icon: 'plus'
    }
  ]);

  public updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Torna alla dashboard
  public goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }

  // Cliccando il +, mandiamo l'utente alla pagina di aggiunta passandogli l'ID del prodotto
  public addExistingToStock(productId: string): void {
    this.router.navigate(['/s-admin-add-existing-item'], { queryParams: { id: productId } });
  }

  // Cliccando la card, andiamo alla pagina di creazione di un prodotto da zero
  public addNewToStock(): void {
    this.router.navigate(['/s-admin-add-new-item']);
  }
}