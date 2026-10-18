import { Injectable, computed, inject, signal } from "@angular/core";
import { Operator, SafeOperator, Site, SEED_OPERATORS, SEED_SITES, MockBackendService } from '../app/utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
    // private readonly _operators = signal<Operator[]>(SEED_OPERATORS);
    // private readonly _sites = signal<Site[]>(SEED_SITES);
    // private readonly _currentOperator = signal<Operator | null>(null);

    // readonly isLoggedIn = computed(() => this._currentOperator() !== null);

    // readonly currentUser = computed<SafeOperator | null>(() => {
    //     const op = this._currentOperator();
    //     if (!op) return null;
    //     const { password, ...safe } = op;
    //     return safe;
    // });

    // readonly currentSite = computed<Site | null>(() => {
    //     const op = this._currentOperator();
    //     if (!op) return null;
    //     return this._sites().find(s => s.id === op.siteId) ?? null;
    // });

    // login(inputUsername: string, passwordInput: string, distributionPointName: string): boolean {
    //     const trimmedUsername = inputUsername.trim().toLowerCase();
    //     const foundUser = this._operators().find(
    //         o => o.username.toLowerCase() === trimmedUsername
    //     );

    //     if (!foundUser || foundUser.password !== passwordInput) {
    //         console.warn("Credenziali non valide.");
    //         return false;
    //     }

    //     // Verifica opzionale della coerenza con la sede di distribuzione
    //     const matchedSite = this._sites().find(
    //         s => s.name.toLowerCase().includes(distributionPointName.toLowerCase().trim())
    //     );

    //     if (matchedSite && foundUser.siteId !== matchedSite.id) {
    //         console.warn("La sede selezionata non corrisponde a quella assegnata all'operatore.");
    //     }

    //     this._currentOperator.set(foundUser);
    //     console.log(`Login riuscito per l'utente: ${foundUser.username} con ruolo ${foundUser.role}`);
    //     return true;
    // }

    // logout(): void {
    //     this._currentOperator.set(null);
    //     console.log("Logout effettuato.");
    // }
    private backend = inject(MockBackendService);

    readonly isLoggedIn = this.backend.isLoggedIn;
    readonly currentOperator = this.backend.currentOperator;
    readonly currentSite = this.backend.currentSite;

    async login(username: string, password: string): Promise<SafeOperator> {
        return await this.backend.login(username, password);
    }

    logout(): void {
        this.backend.logout();
    }
}
