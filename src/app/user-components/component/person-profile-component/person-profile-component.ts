import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Transaction {
    date: string;
    location: string;
    operator: string;
    type: string;
    itemsCount: number;
    tokensUsed: number;
}

@Component({
    selector: 'app-person-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './person-profile-component.html',
    styleUrls: ['./person-profile-component.css']
})
export class PersonProfileComponent {
    // Gestione dello stato tramite Signals
    readonly personDetails = signal({
        initials: 'MR',
        name: 'Mario Rossi',
        id: 'ID-2024-0481',
        birthDate: '14/03/1982',
        address: 'Via Roma 24, Legnano (MI)',
        status: 'Idoneo',
        currentTokens: 420,
        maxTokens: 575
    });

    readonly familyNucleus = signal({
        adults: { count: 2, tokensPerPerson: 250 },
        minors: { count: 1, tokensPerPerson: 75 }
    });

    readonly history = signal<Transaction[]>([
        {
            date: '03 ott',
            location: 'Negozio Legnano',
            operator: 'op. M. Turelli',
            type: 'Consegna',
            itemsCount: 3,
            tokensUsed: 95
        },
        {
            date: '14 set',
            location: 'Parabiago',
            operator: 'op. G. Carraro',
            type: 'Consegna',
            itemsCount: 2,
            tokensUsed: 60
        }
    ]);

    goBack(): void {
        console.log('Naviga indietro');
    }

    openOptions(): void {
        console.log('Apri menu opzioni');
    }

    startDelivery(): void {
        console.log('Avvia consegna');
    }
}
