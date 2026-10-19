import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Transaction {
    date: string;
    location: string;
    operator: string;
    type: string;
    itemsCount: number;
    tokensUsed: number;
}

@Component({
    selector: 'app-admin-person-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-personal-profile-component.html',
    styleUrls: ['./admin-personal-profile-component.css']
})
export class AdminPersonProfileComponent {
    private readonly router = inject(Router);
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
        this.router.navigate(['/admin-home']);
    }

    openOptions(): void {
        console.log('Apri menu opzioni');
    }

    startDelivery(): void {
        console.log('Avvia consegna');
    }
}

