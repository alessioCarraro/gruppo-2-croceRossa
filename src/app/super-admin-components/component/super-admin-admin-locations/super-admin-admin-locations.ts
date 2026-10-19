import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockBackendService } from '../../../utils'; // <-- Verifica che i livelli del percorso siano giusti

interface AdminContact {
  id: string;
  initials: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-super-admin-admin-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-admin-locations.html',
  styleUrls: ['./super-admin-admin-locations.css']
})
export class SuperAdminAdminLocationsComponent {
  private readonly router = inject(Router);
  private readonly backendService: MockBackendService = inject(MockBackendService);

  // Generazione dinamica della lista admin dal service
  public readonly adminContacts = computed<AdminContact[]>(() => {
    // Prendiamo tutti gli operatori e filtriamo solo chi ha il ruolo 'Admin'
    const admins = this.backendService.operators().filter(op => op.role === 'Admin');

    return admins.map(admin => {
      // Estrai prima lettera del nome e prima del cognome
      const initials = (admin.firstName.charAt(0) + admin.lastName.charAt(0)).toUpperCase();
      
      // Sfruttiamo il metodo helper del service per avere il nome della sede dall'ID
      const siteName = this.backendService.getSiteName(admin.siteId);

      return {
        id: admin.id,
        initials: initials,
        name: `${admin.firstName} ${admin.lastName}`,
        location: siteName,
        role: admin.role
      };
    });
  });

  // Si aggiorna automaticamente in base alla lunghezza dell'array filtrato
  public readonly totalAdmins = computed<number>(() => this.adminContacts().length);

  // Torna alla dashboard
  goBack(): void {
    this.router.navigate(['/s-admin-home']);
  }

  editAdmin(admin: AdminContact): void {
    console.log('Modifica referente:', admin.name);
    // In futuro potrai mettere qui la navigazione alla pagina di modifica profilo dell'admin
  }
}