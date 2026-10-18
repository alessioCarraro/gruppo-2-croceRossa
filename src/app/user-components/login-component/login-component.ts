import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SEED_OPERATORS, SEED_SITES } from '../../utils';
import { AuthService } from '../../auth.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    selector: 'app-login-component',
    styleUrl: './login-component.css',
    templateUrl: './login-component.html',
})
export class LoginComponent {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    // Stato reattivo gestito tramite Signals
    private readonly username = signal<string>('');
    private readonly password = signal<string>('');
    private readonly distributionPoint = signal<string>('');
    private readonly isLoading = signal(false);
    private readonly loginError = signal<string | null>(null);

    // Segnale computato per il filtraggio dinamico delle sedi in base al nome utente
    availableSites = computed(() => {
        const currentUsername = this.username().trim().toLowerCase();
        if (!currentUsername) {
            return [];
        }

        const matchingOperators = SEED_OPERATORS.filter(
            op => op.username.toLowerCase() === currentUsername
        );

        const siteIds = matchingOperators.map(op => op.siteId);
        return SEED_SITES.filter(site => siteIds.includes(site.id));
    });

    // Segnale computato per estrarre il ruolo direttamente dal nome utente inserito
    userRole = computed(() => {
        const currentUsername = this.username().trim().toLowerCase();
        if (!currentUsername) {
            return null;
        }

        const operator = SEED_OPERATORS.find(
            op => op.username.toLowerCase() === currentUsername
        );

        return operator ? operator.role : null;
    });

    updateUsername(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.username.set(target.value);
        this.distributionPoint.set('');
    }

    updatePassword(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.password.set(target.value);
    }

    updateDistributionPoint(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.distributionPoint.set(target.value);
    }

    async onLogin(): Promise<void> {
        const role = this.userRole();
        this.isLoading.set(true);

        if (!this.username() || !this.password() || !this.distributionPoint()) {
            this.loginError.set('Compilare tutti i campi obbligatori, inclusa la sede.');
            return;
        }

        if (!role) {
            this.loginError.set('Nome utente non riconosciuto nel sistema.');
            return;
        }

        this.loginError.set(null);

        await this.authService.login(this.username(), this.password());
        // Reindirizzamento asincrono basato sul ruolo estratto dall'utente
        await this.redirectBasedOnRole(role);
    }

    private async redirectBasedOnRole(role: string): Promise<void> {
        try {
            switch (role) {
                case 'S-Admin':
                    await this.router.navigate(['/s-admin-home']);
                    break;
                case 'Admin':
                    await this.router.navigate(['/admin-home']);
                    break;
                case 'Operator':
                    await this.router.navigate(['/user-metro-dashboard']);
                    break;
                case 'User':
                default:
                    await this.router.navigate(['/user-home']);
                    break;
            }
        } catch (error) {
            console.error('Errore durante la navigazione post-login:', error);
            this.loginError.set('Impossibile completare il reindirizzamento al momento.');
        }
    }
}