import { Component, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

// ... (Interfacce invariate)
interface UserData { initials: string; name: string; }
interface InfoItem { id: string; label: string; value: string; isMonospace?: boolean; }
interface NavItem { id: string; label: string; iconName: 'home' | 'inventory' | 'upload' | 'profile'; isActive: boolean; }

@Component({
  selector: 'app-admin-metro-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-metro-profile.html',
  styleUrls: ['./admin-metro-profile.css']
})
export class AdminMetroProfileComponent {
  // Uso del servizio Location per gestire il pulsante "Indietro" nativo
  private readonly location = inject(Location);

  readonly user = signal<UserData>({
    initials: 'GF',
    name: 'Giulia Ferri',
  });

  readonly infoItems = signal<InfoItem[]>([
    { id: 'role', label: 'Ruolo', value: 'Admin' },
    { id: 'location', label: 'Sede', value: 'Magazzino Centrale' },
    { id: 'email', label: 'Email', value: 'g.ferri@foodnetwork.it', isMonospace: true },
    { id: 'phone', label: 'Telefono', value: '+39 340 9988776', isMonospace: true }
  ]);

  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home', iconName: 'home', isActive: false },
    { id: 'inventory', label: 'Inventario', iconName: 'inventory', isActive: false },
    { id: 'upload', label: 'Carico', iconName: 'upload', isActive: false },
    { id: 'profile', label: 'Profilo', iconName: 'profile', isActive: true }
  ]);

  goBack(): void {
    // Riporta l'utente all'ultima pagina visitata mantenendo la cronologia
    this.location.back();
  }

  onEditProfile(): void {
    console.log('Azione: Modifica dati profilo');
  }

  onNavClick(navId: string): void {
    this.navItems.update(items =>
      items.map(item => ({ ...item, isActive: item.id === navId }))
    );
  }
}