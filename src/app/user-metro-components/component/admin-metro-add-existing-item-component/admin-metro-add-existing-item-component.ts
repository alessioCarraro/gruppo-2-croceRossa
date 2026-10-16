import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-metro-add-existing-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-add-existing-item-component.html',
  styleUrls: ['./admin-metro-add-existing-item-component.css']
})
export class AdminMetroAddExistingItemComponent {
  public macroCategory = signal<string>('Alimentari');
  public category = signal<string>('Legumi');
  public productType = signal<string>('Ceci in lattina 400g');
  public expiryDate = signal<string>('');
  public quantity = signal<string>('0');

  public updateExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.expiryDate.set(input.value);
  }

  public updateQuantity(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantity.set(input.value);
  }

  public saveLoad(): void {
    console.log('Salvataggio carico in corso...', {
      macro: this.macroCategory(),
      category: this.category(),
      product: this.productType(),
      expiry: this.expiryDate(),
      quantity: this.quantity()
    });
  }
}