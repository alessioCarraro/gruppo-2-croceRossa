import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    selector: 'app-login-component',
    styleUrl: './login-component.css',
    templateUrl: './login-component.html',
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    username = signal<string>('m.turelli');
    password = signal<string>('password');
    distributionPoint = signal<string>('Negozio Legnano — Via Gilardelli');
    loginError = signal<string | null>(null);

    updateUsername(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.username.set(val);
    }

    updatePassword(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.password.set(val);
    }

    updateDistributionPoint(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.distributionPoint.set(val);
    }

    onLogin(): void {
        this.loginError.set(null);
        const success = this.authService.login(this.username(), this.password());

        if (!success) {
            this.loginError.set("Credenziali non valide o utente non autorizzato.");
        }
    }
}