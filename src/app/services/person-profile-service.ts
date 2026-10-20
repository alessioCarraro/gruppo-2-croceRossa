import { Injectable, inject } from '@angular/core';
import { Beneficiary, MockBackendService, TOKENS_PER_ADULTI, TOKENS_PER_MINORI } from '../utils';

export interface Transaction {
    date: string;
    location: string;
    operator: string;
    type: string;
    itemsCount: number;
    tokensUsed: number;
}

/**
 * Dati di una persona (beneficiario) per le schede profilo.
 * Legge sempre dalla fonte condivisa (MockBackendService): nessun dato di esempio.
 */
@Injectable({ providedIn: 'root' })
export class PersonProfileService {
    private readonly backend = inject(MockBackendService);

    /**
     * Cerca una persona dal codice (es. ID-2024-0481) o dall'id.
     * Ignora spazi e maiuscole. Restituisce null se non esiste.
     */
    findByCode(code: string | null | undefined): Beneficiary | null {
        const wanted = (code ?? '').trim().toLowerCase();
        if (!wanted) return null;

        return this.backend.beneficiaries().find(
            b => b.code.toLowerCase() === wanted || b.id.toLowerCase() === wanted
        ) ?? null;
    }

    details(b: Beneficiary | null) {
        if (!b) {
            return { initials: '', name: '', id: '', birthDate: '', address: '', status: '', currentTokens: 0, maxTokens: 0 };
        }
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
    }

    family(b: Beneficiary | null) {
        return {
            adults: { count: b?.adults ?? 0, tokensPerPerson: TOKENS_PER_ADULTI },
            minors: { count: b?.minors ?? 0, tokensPerPerson: TOKENS_PER_MINORI }
        };
    }

    // Storico dalle consegne salvate nei dati condivisi
    history(b: Beneficiary | null): Transaction[] {
        if (!b) return [];
        return this.backend.deliveries()
            .filter(d => d.beneficiaryId === b.id)
            .map(d => ({
                date: new Date(d.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }).replace('.', ''),
                location: this.backend.getSiteName(d.siteId),
                operator: 'op. ' + this.backend.getOperatorName(d.operatorId),
                type: 'Consegna',
                itemsCount: d.items.reduce((sum, i) => sum + i.quantity, 0),
                tokensUsed: d.tokensUsed
            }));
    }
}
