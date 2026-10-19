import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification-service';

/**
 * Card di notifica riutilizzabile: basta inserire <app-notification-card />
 * nella pagina. Mostra la notifica corrente del NotificationService.
 */
@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-card-component.html',
  styleUrls: ['./notification-card-component.css']
})
export class NotificationCardComponent {
  public readonly notifications = inject(NotificationService);
}
