import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { MockBackendService } from '../../../utils';

@Component({
    selector: 'app-admin-home',
    standalone: true,
    imports: [FormsModule], // Obbligatorio per [ngModel]
    templateUrl: './admin-home-component.html',
    styleUrls: ['./admin-home-component.css']
})
export class AdminHomeComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly backend = inject(MockBackendService);

    private readonly currentUser = this.authService.currentOperator;
    private readonly currentSite = this.authService.currentSite;
    private readonly activeTab = signal('home');

    readonly userName = computed(() => this.currentUser()?.firstName ?? 'Ospite');
    readonly storeName = computed(() => this.currentSite()?.name ?? 'Sede non specificata');
    // Gestione dello stato tramite Signals
    readonly searchQuery = signal(''); // Signal per la barra di ricerca

    readonly userProfile = signal({
        name: 'Marta',
        storeName: 'Sede Legnano',
        storeAddress: 'Via Gilardelli',
        role: 'Admin',
        initial: 'person'
    });

    readonly statsToday = signal([
        { value: '41', label: 'Consegne registrate', subLabel: 'rete locale', actionText: null, actionType: null },
        { value: '5', label: 'Colli in arrivo', subLabel: null, actionText: 'conferma ricezione', actionType: 'primary', route: '/admin-tracking-number' },
        { value: '7', label: 'Prodotti in esaurimento', subLabel: null, actionText: 'aggiungi all\'ordine', actionType: 'danger', route: '/admin-low-stock' },
        { value: '12', label: 'Prossimi a scadenza', subLabel: null, actionText: 'entro 14 gg', actionType: 'warning', route: '/admin-expiring-product' }
    ]);

    // Risultati della ricerca: prodotti del catalogo condiviso (stessi dati delle altre sezioni)
    readonly searchResults = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return [];

        const siteId = this.currentUser()?.siteId;
        const inventories = this.backend.inventories();

        return this.backend.products()
            .filter(p => p.name.toLowerCase().includes(query))
            .map(p => ({
                id: p.id,
                name: p.name,
                // Giacenza del prodotto nella sede dell'Admin
                siteStock: inventories.find(i => i.siteId === siteId && i.productId === p.id)?.stock ?? 0
            }));
    });

    // Apre la pagina "Altre sedi" per il prodotto scelto
    selectProduct(productId: string): void {
        this.router.navigate(['/admin-store-locator'], { queryParams: { productId } });
    }

    setTab(tab: string): void {
        this.activeTab.set(tab);
        if (tab === 'home') {
            this.router.navigate(['/admin-home']);
        }
        if (tab === 'scansione') {
            this.router.navigate(['/admin-qr-scanner']);
        }
        if (tab === 'magazzino') {
            this.router.navigate(['/admin-warehouse']);
        }
        if (tab === 'sedi') {
            this.router.navigate(['/admin-store-locator']);
        }
        if (tab === 'approvazioni') {
            this.router.navigate(['/admin-requests']);
        }
        // Profilo dell'Admin loggato
        if (tab === 'profilo') {
            this.router.navigate(['/admin-my-profile']);
        }
        if (tab === 'colli') {
            this.router.navigate(['/admin-tracking-number']);
        }
    }

    onLogout(): void {
        this.router.navigate(['/login']);
    }

    navigateTo(route?: string): void {
        if (route) {
            this.router.navigate([route]);
        }
    }
}