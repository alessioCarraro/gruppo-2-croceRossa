import { computed, signal } from "@angular/core";
import { User } from "./tables.models";

export class AuthService {
    private readonly user = signal<User[]>([
        { id: "038929ab-6247-4542-b43d-118ba55a5132", username: "admin", password: "string", is_active: true, can_login: true },
        { id: "cdce36fd-0c27-452e-b76f-859500f735f8", username: "user", password: "string", is_active: true, can_login: true },
        { id: "fa353178-ea94-4fd1-a8af-77f10f1ab2e0", username: "super_admin", password: "string", is_active: true, can_login: true },
        { id: "8849f731-fbc5-4047-bf43-9f7f0d275331", username: "operator", password: "string", is_active: true, can_login: true }
    ])
    private readonly _currentUser = signal<User | null>(null);
    readonly isLoggedIn = computed(() => this._currentUser() !== null);
    readonly currentUser = this._currentUser.asReadonly();

    login(inputUsername: string, passwordInput: string): boolean {
        const foundUser = this.user().find(u => u.username === inputUsername)

        if (!foundUser || foundUser.password !== passwordInput) {
            console.warn("Credenziali non valide!");
            return false;
        }

        if (!foundUser.is_active || !foundUser.can_login) {
            console.warn("Account disattivato o non autorizzato al login.");
            return false;
        }

        this._currentUser.set(foundUser);
        console.log(`Login riuscito per l'utente: ${foundUser.username}`);
        return true;
    }
    
    logout(): void {
        this._currentUser.set(null);
        console.log("Logout effettuato.");
    }
}