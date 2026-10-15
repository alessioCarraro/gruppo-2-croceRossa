import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class PersonalProfileNotokenComponent {
  // Stato del profilo gestito tramite Signals
  public readonly person = signal<PersonData>({
    initials: 'BN',
    fullName: 'Luca Bianchi',
    idCode: 'IO-2024-0377',
    statusLabel: 'Idoneo',
    tokensRemaining: 0,
    tokensTotal: 575
  });

  // Stato derivato per la logica condizionale e di visualizzazione
  public readonly isTokensDepleted = computed(() => {
    return this.person().tokensRemaining <= 0;
  });

  public readonly progressPercentage = computed(() => {
    const { tokensRemaining, tokensTotal } = this.person();
    if (tokensTotal === 0) return 0;
    return (tokensRemaining / tokensTotal) * 100;
  });

  // Azioni utente
  public goBack(): void {
    console.log('Navigazione: Torna indietro');
  }

  public requestExtraTokens(): void {
    console.log('Azione: Richiesta extra token inviata all\'admin');
  }
}