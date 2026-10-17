import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StockOption {
  id: string;
  title: string;
  description: string;
  icon: 'box' | 'plus';
}

interface SearchResult {
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
  public searchQuery = signal<string>('Lattina di ceci');
  
  public searchResult = signal<SearchResult | null>({
    name: 'Lattina di ceci',
    weight: '400g',
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
    
    if (input.value.toLowerCase().includes('ceci')) {
      this.searchResult.set({ name: 'Lattina di ceci', weight: '400g'});
    } else {
      this.searchResult.set(null);
    }
  }

  public addToStock(): void {
    console.log('Aggiunto al magazzino:', this.searchResult()?.name);
  }
}