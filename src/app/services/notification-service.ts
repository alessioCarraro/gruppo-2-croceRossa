import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  type: NotificationType;
  message: string;
}

// Durata di visualizzazione della card (in millisecondi)
const NOTIFICATION_DURATION_MS = 4000;

/**
 * Servizio per le notifiche (card di conferma / errore / info).
 * È un servizio "root", quindi la notifica sopravvive al cambio pagina:
 * si può mostrare prima di navigare e vederla nella pagina di destinazione.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notification = signal<AppNotification | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  // Vero dopo la prima navigazione successiva alla notifica (quella che porta alla pagina di destinazione)
  private survivedNavigation = false;

  constructor() {
    // La notifica sopravvive al cambio pagina che segue l'invio, ma alla navigazione dopo sparisce:
    // così tornando in una pagina non ricompare una notifica vecchia
    inject(Router).events.subscribe(event => {
      if (event instanceof NavigationEnd && this._notification()) {
        if (this.survivedNavigation) {
          this.dismiss();
        } else {
          this.survivedNavigation = true;
        }
      }
    });
  }

  // Notifica corrente (null = nessuna card visibile)
  readonly notification = this._notification.asReadonly();

  show(type: NotificationType, message: string): void {
    // Se c'era già una card, azzera il timer precedente
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this._notification.set({ type, message });
    this.survivedNavigation = false;

    // La card sparisce da sola dopo pochi secondi
    this.timeoutId = setTimeout(() => this.dismiss(), NOTIFICATION_DURATION_MS);
  }

  success(message: string): void { this.show('success', message); }
  error(message: string): void { this.show('error', message); }
  info(message: string): void { this.show('info', message); }

  dismiss(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this._notification.set(null);
  }
}
