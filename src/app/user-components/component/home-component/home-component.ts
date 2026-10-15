import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';

@Component({
    imports: [FormsModule],
    selector: 'app-home-component',
    styleUrl: './home-component.css',
    templateUrl: './home-component.html',
})
export class HomeComponent {
    private readonly authService = inject(AuthService);

    readonly currentUser = this.authService.currentUser;
    readonly currentSite = this.authService.currentSite;

    userName = computed(() => this.currentUser()?.firstName ?? 'Ospite');
    storeName = computed(() => this.currentSite()?.name ?? 'Sede non specificata');

    userInitials = computed(() => {
        const user = this.currentUser();
        if (!user) return '--';
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    });

    scanId = signal('ID-2024-0481');
    activeTab = signal('home');

    simulateScan(): void {
        console.log('Scansione simulata con successo');
    }

    searchById(): void {
        console.log('Ricerca per ID:', this.scanId());
    }

    setTab(tab: string): void {
        this.activeTab.set(tab);
    }
}
