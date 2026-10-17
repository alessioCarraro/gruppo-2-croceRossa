import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../person-profile-component/person-profile-component';
import { Router } from '@angular/router';

interface PersonData {
    initials: string;
    fullName: string;
    idCode: string;
    statusLabel: string;
    tokensRemaining: number;
    tokensTotal: number;
}


@Component({
    selector: 'app-person-profile-notoken',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './person-profile-notoken.html',
    styleUrls: ['./person-profile-notoken.css']
})
export class PersonProfileNotokenComponent {
    private readonly router = inject(Router);
    // Gestione dello stato tramite Signals
    readonly personDetails = signal({
        initials: 'MR',
        name: 'Mario Rossi',
        id: 'ID-2024-0481',
        birthDate: '14/03/1982',
        address: 'Via Roma 24, Legnano (MI)',
        status: 'Idoneo',
        currentTokens: 0,
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

    public readonly person = signal<PersonData>({
        initials: 'BN',
        fullName: 'Luca Bianchi',
        idCode: 'IO-2024-0377',
        statusLabel: 'Idoneo',
        tokensRemaining: 0,
        tokensTotal: 575
    });

    public readonly isTokensDepleted = computed(() => {
        return this.person().tokensRemaining <= 0;
    });

    goBack(): void {
        this.router.navigate(['/home']);
    }

    openOptions(): void {
        console.log('Apri menu opzioni');
    }

    startDelivery(): void {
        console.log('Avvia consegna');
    }
}
