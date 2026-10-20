import { Component, signal, computed, WritableSignal, HostListener, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';
import { NotificationService } from '../../../services/notification-service';
import { NotificationCardComponent } from '../../../notification-card-component/notification-card-component';

type DropdownType = 'macro' | 'category' | null;

@Component({
  selector: 'app-super-admin-add-new-item',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './super-admin-add-new-item-component.html',
  styleUrls: ['./super-admin-add-new-item-component.css']
})
export class SuperAdminAddNewItemComponent implements OnInit {
  protected readonly router = inject(Router);
  protected readonly backendService = inject(MockBackendService);
  protected readonly elementRef = inject(ElementRef);
  // Servizio delle card di notifica (errori in rosso, conferme)
  protected readonly notifications = inject(NotificationService);
  
  public macroCategory = signal<string>('Alimentari');
  public category = signal<string>('');
  public productType = signal<string>('');
  public expiryDate = signal<string>('');
  public quantity = signal<string>('');
  public tokenValue = signal<string>('');
  public errorMessage = signal<string | null>(null);

  // Testo del pulsante in basso: l'operator lo cambia in "Invia a conferma del superadmin"
  public submitLabel = 'Salva nuovo prodotto';
  // Evita doppi invii (usato dall'operator)
  public isSubmitting = signal<boolean>(false);

  public activeDropdown = signal<DropdownType>(null);
  public isMacroCustom = signal<boolean>(false);
  public isCategoryCustom = signal<boolean>(false);
  public isProductDropdownOpen = signal<boolean>(false);

  // Macro-categorie disponibili
  public availableMacroCategories = computed<string[]>(() => {
    return ['Alimentari'];
  });

  // Categorie filtrate in base alla macro-categoria attiva
  public availableCategories = computed<string[]>(() => {
    const currentMacro = this.macroCategory();
    
    // Se l'utente ha scritto una macro-categoria personalizzata (es. "Vestiti") 
    // che non è tra quelle standard, non ci sono categorie pre-esistenti: parte pulito.
    if (this.isMacroCustom() || currentMacro !== 'Alimentari') {
      return []; 
    }

    // Altrimenti estraiamo le categorie reali dal database per "Alimentari"
    const products = this.backendService.products();
    const uniqueCats = new Set(products.map(p => p.category));
    return Array.from(uniqueCats);
  });

  // Suggerimenti prodotti filtrati in base alla categoria attiva
  public productSuggestions = computed<string[]>(() => {
    const query = this.productType().toLowerCase().trim();
    const currentCat = this.category();
    const prods = this.backendService.products();
    
    // Se la categoria è custom o nuova, non ci sono suggerimenti iniziali dal catalogo
    if (this.isCategoryCustom() || !currentCat) {
      if (!query) return [];
      // Cerca in tutto il catalogo se l'utente sta scrivendo
      const allNames = Array.from(new Set(prods.map(p => p.name)));
      return allNames.filter(n => n.toLowerCase().includes(query));
    }

    // Altrimenti filtra i prodotti di quella specifica categoria
    const catProds = prods.filter(p => p.category === currentCat);
    const names = Array.from(new Set(catProds.map(p => p.name)));
    
    if (!query) return names.slice(0, 5); // Mostra i primi se il campo è vuoto ma attivo
    return names.filter(n => n.toLowerCase().includes(query));
  });

  ngOnInit(): void {
    const macros = this.availableMacroCategories();
    if (macros.length > 0) {
      this.macroCategory.set(macros[0]);
    }
    const cats = this.availableCategories();
    if (cats.length > 0) {
      this.category.set(cats[0]);
    }
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.activeDropdown.set(null);
      this.isProductDropdownOpen.set(false);
    }
  }

  public toggleDropdown(dropdown: DropdownType, event: Event): void {
    event.stopPropagation();
    this.activeDropdown.update(current => current === dropdown ? null : dropdown);
    this.isProductDropdownOpen.set(false);
  }

  public selectMacroCategory(value: string): void {
    this.macroCategory.set(value);
    this.isMacroCustom.set(false);
    
    // Quando cambi macro-categoria, resetta la categoria sottostante
    const products = this.backendService.products();
    if (value === 'Alimentari') {
      const cats = Array.from(new Set(products.map(p => p.category)));
      this.category.set(cats.length > 0 ? cats[0] : '');
      this.isCategoryCustom.set(false);
    } else {
      // Per macro-categorie nuove/custom, azzeriamo e apriamo la scrittura manuale
      this.category.set('');
      this.isCategoryCustom.set(true);
    }
    
    this.activeDropdown.set(null);
  }

  public selectCategory(value: string): void {
    this.category.set(value);
    this.isCategoryCustom.set(false);
    this.productType.set(''); // Reset del prodotto
    this.activeDropdown.set(null);
  }

  public updateSignalValue(signalRef: WritableSignal<string>, event: Event): void {
    const input = event.target as HTMLInputElement;
    signalRef.set(input.value);
  }

  public onProductInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productType.set(input.value);
    this.isProductDropdownOpen.set(true);
  }

  public selectProductSuggestion(value: string): void {
    this.productType.set(value);
    this.isProductDropdownOpen.set(false);
  }

  public goBack(): void {
    this.router.navigate(['/s-admin-load-item']);
  }

  public enableCustomMode(field: DropdownType): void {
    if (field === 'macro') {
      this.isMacroCustom.set(true);
      this.macroCategory.set('');
      // Se scrivi una macro a mano, la categoria diventa automaticamente scrivibile a mano e vuota
      this.isCategoryCustom.set(true);
      this.category.set('');
    } else if (field === 'category') {
      this.isCategoryCustom.set(true);
      this.category.set('');
    }
    this.activeDropdown.set(null);
  }

  public revertCustomMode(field: DropdownType): void {
    if (field === 'macro') {
      this.isMacroCustom.set(false);
      const macros = this.availableMacroCategories();
      this.macroCategory.set(macros.length > 0 ? macros[0] : '');
      this.isCategoryCustom.set(false);
      const cats = this.availableCategories();
      this.category.set(cats.length > 0 ? cats[0] : '');
    } else if (field === 'category') {
      this.isCategoryCustom.set(false);
      const cats = this.availableCategories();
      this.category.set(cats.length > 0 ? cats[0] : '');
    }
  }

  /**
   * Elenco dei campi mancanti o non validi.
   * È condiviso: lo usano sia il super admin sia la pagina operator (che estende questo componente).
   */
  protected getMissingFields(): string[] {
    const missingFields: string[] = [];
    if (!this.macroCategory().trim()) missingFields.push('Macro-categoria');
    if (!this.category().trim()) missingFields.push('Categoria');
    if (!this.productType().trim()) missingFields.push('Tipo prodotto');
    if (!this.expiryDate()) missingFields.push('Scadenza');

    const qty = parseInt(this.quantity(), 10);
    if (isNaN(qty) || qty <= 0) missingFields.push('Quantità');

    const token = parseInt(this.tokenValue(), 10);
    if (isNaN(token) || token < 0) missingFields.push('Valuta token');

    return missingFields;
  }

  public submitForm(event?: Event): void | Promise<void> {
    if (event) event.preventDefault();

    const missingFields = this.getMissingFields();
    if (missingFields.length > 0) {
      // Card rossa invece dell'alert del browser
      this.notifications.error('Compila o correggi i campi: ' + missingFields.join(', '));
      return;
    }

    const qty = parseInt(this.quantity(), 10);
    const token = parseInt(this.tokenValue(), 10);
    const name = this.productType().trim();
    const cat = this.category().trim();
    const exp = this.expiryDate();

    const existingProduct = this.backendService.products().find(p => p.name.toLowerCase() === name.toLowerCase());

    if (existingProduct) {
      this.backendService.addStockToInventory(existingProduct.id, qty, exp);
    } else {
      this.backendService.registerNewProductAndStock(name, cat, token, qty, exp);
    }

    this.router.navigate(['/s-admin-metro-stock']);
  }
}