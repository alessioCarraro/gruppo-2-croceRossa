import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonProfileService } from '../../services/person-profile-service';

export type { Transaction } from '../../services/person-profile-service';

@Component({
    selector: 'app-person-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './person-profile-component.html',
    styleUrls: ['./person-profile-component.css']
})
export class PersonProfileComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly profiles = inject(PersonProfileService);

    // Persona cercata: arriva dal codice nella home (?id=...). Si rilegge a ogni cambio di parametro,
    // quindi non restano mai i dati di una persona precedente.
    private readonly query = toSignal(this.route.queryParamMap);
    private readonly person = computed(() => this.profiles.findByCode(this.query()?.get('id')));

    readonly personDetails = computed(() => this.profiles.details(this.person()));
    readonly familyNucleus = computed(() => this.profiles.family(this.person()));
    readonly history = computed(() => this.profiles.history(this.person()));

    constructor() {
        // Nessuna persona valida: non si mostra un profilo di esempio, si torna alla ricerca
        if (!this.person()) {
            this.router.navigate(['/user-home'], { replaceUrl: true });
        }
    }

    goBack(): void {
        this.router.navigate(['/user-home']);
    }

    openOptions(): void {
        console.log('Apri menu opzioni');
    }

    startDelivery(): void {
        this.router.navigate(['/product-catalog']);
    }
}
