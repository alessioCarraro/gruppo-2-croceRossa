import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Beneficiary, SEED_BENEFICIARIES } from '../../utils';

@Component({
    imports: [FormsModule],
    selector: 'app-home-component',
    styleUrl: './home-component.css',
    templateUrl: './home-component.html',
})
export class HomeComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly currentUser = this.authService.currentUser;
    readonly currentSite = this.authService.currentSite;
    readonly beneficiaries = signal<Beneficiary[]>(SEED_BENEFICIARIES);
    readonly userName = computed(() => this.currentUser()?.firstName ?? 'Ospite');
    readonly storeName = computed(() => this.currentSite()?.name ?? 'Sede non specificata');
    readonly scanId = signal<string>('ID-2024-0481');
    readonly activeTab = signal('home');

    userInitials = computed(() => {
        const user = this.currentUser();
        if (!user) return '--';
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    });

    searchById(): void {
        this.processBeneficiary(this.scanId());
    }

    scan(): void {
        this.processBeneficiary(this.scanId());
    }

    private processBeneficiary(id: string): void {
        const found = this.beneficiaries().find(
            b => b.code === id || b.id === id
        );

        if (!found) {
            console.warn('Nessun beneficiario trovato con il codice:', id);
            return;
        }

        const hasTokens = found.tokens > 0;

        if (!hasTokens) {
            this.router.navigate(['/person-profile-notoken'], { queryParams: { id: found.id } });
        } else {
            this.router.navigate(['/person-profile'], { queryParams: { id: found.id } });
        }
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
}
