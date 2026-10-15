import { Component, signal } from '@angular/core';
import { ScannerComponent } from '../scanner-component/scanner-component';
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
    imports: [ScannerComponent, FormsModule],
    selector: 'app-home-component',
    styleUrl: './home-component.css',
    templateUrl: './home-component.html',
})
export class HomeComponent {
    userName = signal('Marco');
    storeName = signal('Negozio Legnano - Via Gilardelli');
    userInitials = signal('MT');
    scanId = signal('ID-2024-0481');
    activeTab = signal('home');

    simulateScan(): void {
        console.log('Scansione simulata con successo');
    }

    searchById(): void {
        console.log('Ricerca per ID:', this.scanId());
    }

    setTab(tab: string): void {
        this.activeTab.set(tab);
    }
}
