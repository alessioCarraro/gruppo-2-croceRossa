import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

interface AdminContact {
  id: string;
  initials: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-admin-metro-admin-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-admin-locations.html',
  styleUrls: ['./admin-metro-admin-locations.css']
})
export class AdminMetroAdminLocationsComponent {
  // 1. Inietta il servizio nativo Location per gestire la history del browser
  private readonly location = inject(Location);

  public readonly adminContacts = signal<AdminContact[]>([
    {
      id: '1',
      initials: 'MC',
      name: 'Marta Conti',
      location: 'Negozio Legnano - Via Gilardelli',
      role: 'Admin'
    },
    {
      id: '2',
      initials: 'LB',
      name: 'Luca Beretta',
      location: 'Negozio Parabiago',
      role: 'Admin'
    },
    {
      id: '3',
      initials: 'SV',
      name: 'Sara Villa',
      location: 'S. Vittore Olona',
      role: 'Admin'
    },
    {
      id: '4',
      initials: 'PR',
      name: 'Paolo Riva',
      location: 'Canegrate',
      role: 'Admin'
    },
    {
      id: '5',
      initials: 'EM',
      name: 'Elena Mauri',
      location: 'Busto Garolfo',
      role: 'Admin'
    },
    {
      id: '6',
      initials: 'DS',
      name: 'Davide Sala',
      location: 'Rescaldina',
      role: 'Admin'
    }
  ]);

  // 2. Utilizza computed() per calcolare dinamicamente e reattivamente il totale
  public readonly totalAdmins = computed(() => this.adminContacts().length);

  /**
   * Riporta l'utente alla schermata precedente (Dashboard)
   */
  public goBack(): void {
    this.location.back();
  }
}