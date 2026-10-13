import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-login-component',
  styleUrl: './login-component.css',
  templateUrl: './login-component.html',
})
export class LoginComponent {
//   // Stato reattivo gestito tramite Signals
//   username = signal('m.turelli');
//   password = signal('password');
//   distributionPoint = signal('Negozio Legnano — Via Gilardelli');

//   onLogin(event: Event): void {
//     event.preventDefault();
//     // Logica di autenticazione simulata via AuthService
//     console.log('Login effettuato con:', {
//       username: this.username(),
//       password: this.password(),
//       distributionPoint: this.distributionPoint()
//     });
//   }

    username = signal<string>('m.turelli');
  password = signal<string>('password');
  distributionPoint = signal<string>('Negozio Legnano — Via Gilardelli');

  updateUsername(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.username.set(val);
  }

  updatePassword(event: Event): string {
    const val = (event.target as HTMLInputElement).value;
    this.password.set(val);
    return val;
  }

  updateDistributionPoint(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.distributionPoint.set(val);
  }

  onLogin(): void {
    console.log('Login effettuato con:', {
      username: this.username(),
      password: this.password(),
      distributionPoint: this.distributionPoint()
    });
  }
}