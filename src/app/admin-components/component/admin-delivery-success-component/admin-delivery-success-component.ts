import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminDeliveryService } from '../../../services/admin-delivery-service';

export interface SummaryItem {
    label: string;
    value: string | number;
    highlight?: boolean;
}

@Component({
    selector: 'app-admin-delivery-success',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-delivery-success-component.html',
    styleUrls: ['./admin-delivery-success-component.css']
})
export class AdminDeliverySuccessComponent {
    private readonly router = inject(Router);
    private readonly delivery = inject(AdminDeliveryService);

    // Stato del componente gestito tramite Signals
    public readonly pageTitle = signal<string>('Consegna registrata');
    public readonly pageSubtitle = signal<string>('Consegna salvata e stock locale aggiornato.');

    // Dati reali dell'ultima consegna confermata (conservati dal servizio, non ricalcolati dalla selezione)
    public readonly summaryDetails = computed<SummaryItem[]>(() => {
        const done = this.delivery.lastConfirmed();
        if (!done) {
            return [{ label: 'Nessuna consegna recente', value: '-' }];
        }

        return [
            { label: 'Beneficiario', value: done.beneficiaryName },
            ...done.items.map(item => ({ label: item.name, value: `× ${item.quantity}` })),
            { label: 'Numero prodotti', value: done.totalUnits },
            { label: 'Token usati', value: done.tokensUsed },
            { label: 'Token residui', value: `${done.remainingTokens} / ${done.maxTokens}`, highlight: true }
        ];
    });

    public navigateToDashboard(): void {
        this.router.navigate(['/admin-home']);
    }

    public startNewIdentification(): void {
        this.router.navigate(['/admin-qr-scanner']);
    }
}
