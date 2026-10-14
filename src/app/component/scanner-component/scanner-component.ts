import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DashboardCard {
    value: string;
    valueColor: string;
    title: string;
    subtitle: string;
    subtitleColor?: string;
    isLink?: boolean;
}

@Component({
    selector: 'app-scanner-component',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './scanner-component.html',
    styleUrls: ['./scanner-component.css']
})
export class ScannerComponent {
    readonly todayCards = signal<DashboardCard[]>([
        { value: '34', valueColor: '#1a2b49', title: 'Consegne registrate', subtitle: 'solo riepilogo' },
        { value: '5', valueColor: '#1b5a96', title: 'Colli in arrivo', subtitle: 'vedi dettaglio', subtitleColor: '#1b5a96', isLink: true },
        { value: '7', valueColor: '#d32f2f', title: 'Prodotti in esaurimento', subtitle: 'riordina', subtitleColor: '#d32f2f', isLink: true },
        { value: '12', valueColor: '#c07c00', title: 'Prossimi a scadenza', subtitle: 'entro 14 gg', subtitleColor: '#c07c00' }
    ]);

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
