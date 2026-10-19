import { Component, inject, signal } from '@angular/core';
import { Beneficiary, SEED_BENEFICIARIES } from '../../../utils';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-qr-scanner',
    standalone: true,
    templateUrl: './admin-qr-scanner-component.html',
    styleUrls: ['./admin-qr-scanner-component.css']
})
export class AdminQrScannerComponent {
    private readonly router = inject(Router);

    private readonly beneficiaries = signal<Beneficiary[]>(SEED_BENEFICIARIES);
    private readonly scanId = signal<string>('ID-2024-0481');

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
            this.router.navigate(['/admin-profile'], { queryParams: { id: found.id } });
        }
    }

    goBack(): void {
        this.router.navigate(['/admin-home']);
    }
}
