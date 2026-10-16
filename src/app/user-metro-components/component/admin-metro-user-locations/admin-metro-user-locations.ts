import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  public userContacts = signal<UserContact[]>([
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

  public totalUsers = signal<number>(this.userContacts().length);
}