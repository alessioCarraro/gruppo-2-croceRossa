import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  public adminContacts = signal<AdminContact[]>([
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

  public totalAdmins = signal<number>(this.adminContacts().length);
}
