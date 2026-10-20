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
    readonly username = signal<string>('');
    readonly password = signal<string>('');
    readonly distributionPoint = signal<string>('');
    readonly isLoading = signal(false);
    readonly loginError = signal<string | null>(null);
    // Elenco delle sedi aperto o chiuso (menu personalizzato, adatto al telefono)
    readonly isSiteListOpen = signal(false);

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
        // Cambiando utente, la sede scelta prima non vale più
        this.distributionPoint.set('');
        this.isSiteListOpen.set(false);
        this.loginError.set(null);
    }

    updatePassword(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.password.set(target.value);
        this.loginError.set(null);
    }

    // Apre o chiude l'elenco delle sedi (solo se ce ne sono)
    toggleSiteList(): void {
        if (this.availableSites().length === 0) return;
        this.isSiteListOpen.update(open => !open);
    }

    selectSite(siteName: string): void {
        this.distributionPoint.set(siteName);
        this.isSiteListOpen.set(false);
        this.loginError.set(null);
    }

    async onLogin(): Promise<void> {
        if (this.isLoading()) return;
        this.loginError.set(null);

        // 1. Campi obbligatori
        if (!this.username().trim() || !this.password()) {
            this.loginError.set('Inserisci nome utente e password.');
            return;
        }

        // 2. Il nome utente deve esistere
        const role = this.userRole();
        if (!role) {
            this.loginError.set('Nome utente non riconosciuto.');
            return;
        }

        // 3. La sede va scelta
        if (!this.distributionPoint()) {
            this.loginError.set('Seleziona il punto di distribuzione.');
            return;
        }

        // 4. Verifica delle credenziali: se falliscono si mostra un errore chiaro
        this.isLoading.set(true);
        let loggedIn = false;
        try {
            await this.authService.login(this.username(), this.password());
            loggedIn = true;
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            // L'utente esiste (controllo 2): se le credenziali non valgono, la password è sbagliata
            this.loginError.set(
                message === 'Credenziali non valide'
                    ? 'Password non corretta.'
                    : message || 'Accesso non riuscito. Riprova.'
            );
        } finally {
            this.isLoading.set(false);
        }

        // Reindirizzamento asincrono basato sul ruolo estratto dall'utente
        if (loggedIn) {
            await this.redirectBasedOnRole(role);
        }
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
                    await this.router.navigate(['/user-home']);
                    break;
            }
        } catch (error) {
            console.error('Errore durante la navigazione post-login:', error);
            this.loginError.set('Impossibile completare il reindirizzamento al momento.');
        }
    }
}
