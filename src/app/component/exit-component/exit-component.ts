import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  value: string;
  label: string;
  colorClass: string;
  action?: string;
  hasArrow?: boolean;
}

interface ControlItem {
  icon: string;
  title: string;
  subtitle: string;
  badgeValue: number;
  badgeClass: string;
  iconClass: string;
}

interface NavItem {
  icon: string;
  label: string;
  isActive: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-component.html',
  styleUrls: ['./exit-component.css']
})
export class ExitComponent {
  // Dati utente
  public readonly userName = signal<string>('Giulia');
  public readonly userRole = signal<string>('Magazzino');
  public readonly location = signal<string>('Magazzino Centrale · Legnano');

  // Dati statistiche
  public readonly stats = signal<StatCard[]>([
    { value: '8', label: 'Colli in ingresso oggi', colorClass: 'text-blue' },
    { value: '15', label: 'Colli in uscita', colorClass: 'text-green' },
    { value: '38.4k', label: 'Merce in magazzino', colorClass: 'text-dark' },
    { value: '6', label: 'Richieste dalle sedi', colorClass: 'text-blue', action: 'gestisci', hasArrow: true }
  ]);

  // Dati controlli
  public readonly controls = signal<ControlItem[]>([
    { 
      icon: 'clock', 
      title: 'Prodotti in scadenza', 
      subtitle: 'entro 10 giorni', 
      badgeValue: 9, 
      badgeClass: 'badge-orange',
      iconClass: 'icon-brown'
    },
    { 
      icon: 'users', 
      title: 'Admin delle sedi', 
      subtitle: 'referenti per sede', 
      badgeValue: 6, 
      badgeClass: 'badge-grey',
      iconClass: 'icon-blue'
    }
  ]);

  // Navigazione
  public readonly navItems = signal<NavItem[]>([
    { icon: 'home', label: 'Home', isActive: true },
    { icon: 'box', label: 'Inventario', isActive: false },
    { icon: 'download', label: 'Carico', isActive: false },
    { icon: 'truck', label: 'Rifornitura', isActive: false }
  ]);
}
