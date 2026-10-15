import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    selector: 'app-login-component',
    styleUrl: './login-component.css',
    templateUrl: './login-component.html',
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    username = signal<string>('n.turelli');
    password = signal<string>('password');
    distributionPoint = signal<string>('Negozio Legnano');
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

    async onLogin(): Promise<void> {
        this.loginError.set(null);
        try {
            // Gestione corretta della chiamata asincrona al servizio di autenticazione
            await this.authService.login(
                this.username(),
                this.password(),
                this.distributionPoint()
            );
            
            // Reindirizzamento eseguito solo dopo la risoluzione e il salvataggio dello stato
            await this.router.navigate(['/home']);
        } catch (err: any) {
            this.loginError.set(err.message || "Credenziali non valide o utente non autorizzato.");
        }
    }
}