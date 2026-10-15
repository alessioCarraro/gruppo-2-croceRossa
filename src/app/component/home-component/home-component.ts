import { Component, signal } from '@angular/core';
import { ScannerComponent } from '../scanner-component/scanner-component';

interface DashboardCard {
    value: string;
    valueColor: string;
    title: string;
    subtitle: string;
    subtitleColor?: string;
    isLink?: boolean;
}

@Component({
    imports: [ScannerComponent],
    selector: 'app-home-component',
    styleUrl: './home-component.css',
    templateUrl: './home-component.html',
})
export class HomeComponent {
    readonly todayCards = signal<DashboardCard[]>([
        { value: '34', valueColor: '#1a2b49', title: 'Consegne registrate', subtitle: 'solo riepilogo' },
        { value: '5', valueColor: '#1b5a96', title: 'Colli in arrivo', subtitle: 'vedi dettaglio', subtitleColor: '#1b5a96', isLink: true },
        { value: '7', valueColor: '#d32f2f', title: 'Prodotti in esaurimento', subtitle: 'riordina', subtitleColor: '#d32f2f', isLink: true },
        { value: '12', valueColor: '#c07c00', title: 'Prossimi a scadenza', subtitle: 'entro 14 gg', subtitleColor: '#c07c00' }
    ]);
}
