import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { PersonProfileService } from '../../services/person-profile-service';

@Component({
    imports: [FormsModule],
    selector: 'app-home-component',
    styleUrl: './home-component.css',
    templateUrl: './home-component.html',
})
export class HomeComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    private readonly currentUser = this.authService.currentOperator;
    private readonly currentSite = this.authService.currentSite;
    private readonly profiles = inject(PersonProfileService);

    // Codice scritto nel campo (o letto dalla scansione): parte vuoto, nessuna persona di esempio
    readonly scanId = signal<string>('');
    // Messaggio di errore della ricerca (vuoto = nessun errore)
    readonly scanError = signal<string>('');
    private readonly activeTab = signal('home');
    
    readonly userName = computed(() => this.currentUser()?.firstName ?? 'Ospite');
    readonly storeName = computed(() => this.currentSite()?.name ?? 'Sede non specificata');

    userInitials = computed(() => {
        const user = this.currentUser();
        if (!user) return '--';
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    });

    // Cerca col codice scritto a mano
    searchById(): void {
        this.processBeneficiary(this.scanId());
    }

    // Scansione del QR: legge il codice e usa la STESSA ricerca dell'inserimento manuale.
    // (Non c'è ancora una fotocamera collegata: la scansione simulata usa il codice presente nel campo.)
    scan(): void {
        this.processBeneficiary(this.scanId());
    }

    updateScanId(value: string): void {
        this.scanId.set(value);
        this.scanError.set(''); // chi sta correggendo non vede più l'errore
    }

    /**
     * Ricerca unica per codice (manuale e scansione):
     * - campo vuoto: invita a inserire un codice;
     * - codice sconosciuto: errore, nessun profilo aperto;
     * - persona con hasTokens === false: pagina senza token;
     * - tutti gli altri casi: profilo con token.
     * La persona trovata viaggia con l'id nell'indirizzo (?id=...).
     */
    private processBeneficiary(code: string): void {
        if (!code.trim()) {
            this.scanError.set('Inserisci un codice per cercare la persona.');
            return;
        }

        const found = this.profiles.findByCode(code);
        if (!found) {
            this.scanError.set('Nessuna persona trovata per il codice inserito.');
            return;
        }

        this.scanError.set('');
        // Il percorso senza token è quello già registrato nel routing: 'person-profile-no-token'
        const route = found.hasTokens === false ? '/person-profile-no-token' : '/person-profile';
        this.router.navigate([route], { queryParams: { id: found.id } });
    }

    setTab(tab: string): void {
        this.activeTab.set(tab);
        if (tab === 'magazzino') {
            this.router.navigate(['/warehouse']);
        }
        if (tab === 'sedie') {
            this.router.navigate(['/store-locator']);
        }
    }

    onProfile(): void {
        this.router.navigate(['/profile']);
    }

    onLogout(): void {
        this.router.navigate(['/login']);
    }
}
