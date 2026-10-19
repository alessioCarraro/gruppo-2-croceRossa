import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

interface UserContact {
  id: string;
  initials: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-admin-metro-user-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-user-locations.html',
  styleUrls: ['./admin-metro-user-locations.css']
})
export class AdminMetroUserLocationsComponent {
  // Iniezione del servizio nativo Location per la gestione della cronologia
  private readonly location = inject(Location);

  public readonly userContacts = signal<UserContact[]>([
    {
      id: '1',
      initials: 'MR',
      name: 'Mario Rossi',
      location: 'Negozio Legnano - Via Gilardelli',
      role: 'User'
    },
    {
      id: '2',
      initials: 'GB',
      name: 'Giulia Bianchi',
      location: 'Negozio Parabiago',
      role: 'User'
    },
    {
      id: '3',
      initials: 'AF',
      name: 'Alessandro Ferrari',
      location: 'S. Vittore Olona',
      role: 'User'
    },
    {
      id: '4',
      initials: 'LC',
      name: 'Laura Colombo',
      location: 'Canegrate',
      role: 'User'
    }
  ]);

  // Sostituzione del signal statico con un signal derivato reattivo (computed)
  public readonly totalUsers = computed(() => this.userContacts().length);

  /**
   * Riporta l'utente alla schermata precedente (Dashboard)
   */
  public goBack(): void {
    this.location.back();
  }
}