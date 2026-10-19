import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils';

interface UserContact {
  id: string;
  initials: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-super-admin-user-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-user-locations.html',
  styleUrls: ['./super-admin-user-locations.css']
})
export class SuperAdminUserLocationsComponent {
  private readonly router = inject(Router);
  private readonly backendService: MockBackendService = inject(MockBackendService);

  // Generazione dinamica della lista utenti (volontari)
  public readonly userContacts = computed<UserContact[]>(() => {
    // Filtriamo gli operatori prendendo solo 'User' e 'Operator'
    const users = this.backendService.operators().filter(op => op.role === 'User' || op.role === 'Operator');

    return users.map(user => {
      // Calcolo iniziali automatico
      const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
      
      // Nome della sede dal service
      const siteName = this.backendService.getSiteName(user.siteId);

      return {
        id: user.id,
        initials: initials,
        name: `${user.firstName} ${user.lastName}`,
        location: siteName,
        role: user.role
      };
    });
  });

  // Il conteggio si aggiorna in automatico
  public readonly totalUsers = computed<number>(() => this.userContacts().length);

  // Torna alla dashboard
  goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }

  editUser(user: UserContact): void {
    console.log('Modifica utente:', user.name);
  }
}