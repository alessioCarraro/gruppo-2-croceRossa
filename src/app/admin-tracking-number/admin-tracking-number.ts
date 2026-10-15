import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Collo {
  id: string;
  category: string;
  quantity: number;
  status: 'Arrivato' | 'In transito';
}

@Component({
  selector: 'app-admin-tracking-number',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tracking-number.html',
  styleUrls: ['./admin-tracking-number.css']
})
export class AdminTrackingNumberComponent {
  // Mock dei dati per replicare fedelmente l'immagine
  readonly colliList = signal<Collo[]>([
    {
      id: 'COL-7781',
      category: 'Alimentari',
      quantity: 24,
      status: 'Arrivato'
    },
    {
      id: 'COL-7780',
      category: 'Igiene',
      quantity: 12,
      status: 'In transito'
    }
  ]);

  // Badge count hardcoded per corrispondere alla grafica esatta
  readonly totalColli = signal<number>(5);

  goBack(): void {
    console.log('Naviga indietro');
  }
}
