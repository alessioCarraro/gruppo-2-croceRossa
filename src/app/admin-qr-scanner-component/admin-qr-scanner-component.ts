import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-qr-scanner',
  standalone: true,
  templateUrl: './admin-qr-scanner-component.html',
  styleUrls: ['./admin-qr-scanner-component.css']
})
export class AdminQrScannerComponent {
  // Signal per gestire lo stato dell'input testuale in modo reattivo
  manualId = signal('ID-2024-0481');

  goBack(): void {
    console.log('Navigazione indietro');
    // Logica di routing (es. this.location.back())
  }

  simulateScan(): void {
    console.log('Simulazione scansione riuscita attivata');
    // Logica per gestire il successo della scansione
  }

  searchId(): void {
    console.log(`Ricerca avviata per il codice: ${this.manualId()}`);
    // Logica di validazione e ricerca ID
  }

  updateId(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.manualId.set(input.value);
  }
}
