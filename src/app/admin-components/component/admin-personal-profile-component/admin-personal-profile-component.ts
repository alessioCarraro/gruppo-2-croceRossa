import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockBackendService, TOKENS_PER_ADULTI, TOKENS_PER_MINORI } from '../../../utils';
import { AdminDeliveryService } from '../../../services/admin-delivery-service';

export interface Transaction {
    date: string;
    location: string;
    operator: string;
    type: string;
    itemsCount: number;
    tokensUsed: number;
}

@Component({
    selector: 'app-admin-person-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-personal-profile-component.html',
    styleUrls: ['./admin-personal-profile-component.css']
})
export class AdminPersonProfileComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly backend = inject(MockBackendService);
    private readonly delivery = inject(AdminDeliveryService);

    // Beneficiario scelto (?id=...); senza id si usa il primo beneficiario dei dati condivisi
    private readonly beneficiary = computed(() => {
        const id = this.route.snapshot.queryParamMap.get('id');
        const all = this.backend.beneficiaries();
        return all.find(b => b.id === id || b.code === id) ?? all[0];
    });

    readonly personDetails = computed(() => {
        const b = this.beneficiary();
        const [year, month, day] = b.birthDate.split('-');
        return {
            initials: (b.firstName.charAt(0) + b.lastName.charAt(0)).toUpperCase(),
            name: `${b.firstName} ${b.lastName}`,
            id: b.code,
            birthDate: `${day}/${month}/${year}`,
            address: b.address,
            status: b.status === 'Attivo' ? 'Idoneo' : b.status,
            currentTokens: b.tokens,
            maxTokens: this.backend.getMaxTokens(b)
        };
    });

    readonly familyNucleus = computed(() => {
        const b = this.beneficiary();
        return {
            adults: { count: b.adults, tokensPerPerson: TOKENS_PER_ADULTI },
            minors: { count: b.minors, tokensPerPerson: TOKENS_PER_MINORI }
        };
    });

    // Storico dalle consegne salvate nei dati condivisi (compare anche la consegna appena confermata)
    readonly history = computed<Transaction[]>(() => {
        const id = this.beneficiary().id;
        return this.backend.deliveries()
            .filter(d => d.beneficiaryId === id)
            .map(d => ({
                date: new Date(d.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }).replace('.', ''),
                location: this.backend.getSiteName(d.siteId),
                operator: 'op. ' + this.backend.getOperatorName(d.operatorId),
                type: 'Consegna',
                itemsCount: d.items.reduce((sum, i) => sum + i.quantity, 0),
                tokensUsed: d.tokensUsed
            }));
    });

    goBack(): void {
        this.router.navigate(['/admin-home']);
    }

    openOptions(): void {
        console.log('Apri menu opzioni');
    }

    // Avvia la consegna per questo beneficiario (la selezione riparte se il beneficiario cambia)
    startDelivery(): void {
        this.delivery.start(this.beneficiary().id);
        this.router.navigate(['/admin-product-catalog']);
    }
}
