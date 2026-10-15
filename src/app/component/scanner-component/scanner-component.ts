import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-scanner-component',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './scanner-component.html',
    styleUrls: ['./scanner-component.css']
})
export class ScannerComponent {
    // Segnale per la gestione reattiva del valore inserito nell'input testuale
    searchId = signal<string>('');

    goBack(): void {
        console.log('Navigazione: torna indietro');
    }

    simulateScan(): void {
        console.log('Azione: Simulazione scansione riuscita');
    }

    searchById(): void {
        const currentId = this.searchId().trim();
        if (currentId) {
            console.log(`Azione: Ricerca per ID - ${currentId}`);
        }
    }
}
