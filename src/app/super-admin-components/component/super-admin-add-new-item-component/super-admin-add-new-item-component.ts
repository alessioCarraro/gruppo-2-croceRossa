import { Component, signal, computed, WritableSignal, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

type DropdownType = 'macro' | 'category' | 'product' | null;

@Component({
  selector: 'app-super-admin-add-new-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-add-new-item-component.html',
  styleUrls: ['./super-admin-add-new-item-component.css']
})
export class SuperAdminAddNewItemComponent {
  public readonly macroCategories = ['Alimentari', 'Igiene', 'Abbigliamento'];
  public readonly categories = ['Pasta', 'Riso', 'Carne', 'Verdure', 'Frutta', 'Legumi'];

  private readonly productDictionary: Record<string, string[]> = {
    'Pasta': ['Fusilli 500g', 'Fusilli 1kg', 'Rigatoni 500g', 'Rigatoni 1kg'],
    'Riso': ['Basmati 500g', 'Basmati 1kg', 'Venere 500g', 'Venere 1kg'],
    'Carne': ['Petto di pollo 500g', 'Macinato di manzo 400g', 'Fettine di vitello 300g'],
    'Verdure': ['Spinaci surgelati 500g', 'Piselli finissimi 400g', 'Minestrone 600g'],
    'Frutta': ['Mele Gala 1kg', 'Banane 1kg', 'Arance 1kg'],
    'Legumi': ['Ceci in lattina 400g', 'Fagioli borlotti 400g', 'Lenticchie secche 500g'],
    'default': ['-- Seleziona un prodotto --']
  };

  // State Signals per i valori inseriti
  public macroCategory = signal<string>(this.macroCategories[0]);
  public category = signal<string>(this.categories[0]);
  
  public availableProducts = computed(() => {
    const selectedCategory = this.category();
    return this.productDictionary[selectedCategory] || this.productDictionary['default'];
  });

  public productType = signal<string>(this.availableProducts()[0]);
  public expiryDate = signal<string>('');
  public quantity = signal<string>('');
  public tokenValue = signal<string>('');

  // UI State: Gestisce quale dropdown è aperto
  public activeDropdown = signal<DropdownType>(null);

  // UI State: Gestisce se un campo è in modalità inserimento manuale
  public isMacroCustom = signal<boolean>(false);
  public isCategoryCustom = signal<boolean>(false);
  public isProductCustom = signal<boolean>(false);

  private readonly elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.activeDropdown.set(null);
    }
  }

  // --- UI Interactions ---

  public toggleDropdown(dropdown: DropdownType, event: Event): void {
    event.stopPropagation();
    this.activeDropdown.update(current => current === dropdown ? null : dropdown);
  }

  public selectMacroCategory(value: string): void {
    this.macroCategory.set(value);
    this.activeDropdown.set(null);
  }

  public selectCategory(value: string): void {
    this.category.set(value);
    const newProductsList = this.availableProducts();
    this.productType.set(newProductsList[0]);
    this.activeDropdown.set(null);
  }

  public selectProductType(value: string): void {
    this.productType.set(value);
    this.activeDropdown.set(null);
  }

  public updateSignalValue(signalRef: WritableSignal<string>, event: Event): void {
    const input = event.target as HTMLInputElement;
    signalRef.set(input.value);
  }

  // --- Custom Mode Handlers ---

  public enableCustomMode(field: DropdownType): void {
    if (field === 'macro') {
      this.isMacroCustom.set(true);
      this.macroCategory.set(''); // Resetta il valore in attesa dell'input
    } else if (field === 'category') {
      this.isCategoryCustom.set(true);
      this.category.set('');
      // In modalità category custom, anche il prodotto dovrebbe logicamente diventare custom
      this.productType.set('');
      this.isProductCustom.set(true);
    } else if (field === 'product') {
      this.isProductCustom.set(true);
      this.productType.set('');
    }
    this.activeDropdown.set(null); // Chiude la tendina
  }

  public revertCustomMode(field: DropdownType): void {
    if (field === 'macro') {
      this.isMacroCustom.set(false);
      this.macroCategory.set(this.macroCategories[0]); // Torna al default
    } else if (field === 'category') {
      this.isCategoryCustom.set(false);
      this.category.set(this.categories[0]);
      // Ripristina anche il prodotto in base alla categoria ripristinata
      this.isProductCustom.set(false);
      this.productType.set(this.availableProducts()[0]);
    } else if (field === 'product') {
      this.isProductCustom.set(false);
      this.productType.set(this.availableProducts()[0]);
    }
  }

  public submitForm(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    console.log('Invio dati al superadmin...', {
      macro: this.macroCategory(),
      category: this.category(),
      product: this.productType(),
      expiry: this.expiryDate(),
      quantity: this.quantity(),
      token: this.tokenValue(),
      metadata: {
        isMacroCustom: this.isMacroCustom(),
        isCategoryCustom: this.isCategoryCustom(),
        isProductCustom: this.isProductCustom()
      }
    });
  }
}