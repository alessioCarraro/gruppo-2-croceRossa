import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonProfileService } from '../../services/person-profile-service';
import { MockBackendService } from '../../utils';
import { NotificationService } from '../../services/notification-service';
import { NotificationCardComponent } from '../../notification-card-component/notification-card-component';

@Component({
    selector: 'app-person-profile-notoken',
    standalone: true,
    imports: [CommonModule, NotificationCardComponent],
    templateUrl: './person-profile-notoken.html',
    styleUrls: ['./person-profile-notoken.css']
})
export class PersonProfileNotokenComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly profiles = inject(PersonProfileService);
    private readonly backend = inject(MockBackendService);
    private readonly notifications = inject(NotificationService);

    // Evita richieste doppie mentre l'invio è in corso
    readonly isSending = signal<boolean>(false);

    // Persona cercata: arriva dal codice nella home (?id=...). Si rilegge a ogni cambio di parametro,
    // quindi non restano mai i dati di una persona precedente.
    private readonly query = toSignal(this.route.queryParamMap);
    private readonly person = computed(() => this.profiles.findByCode(this.query()?.get('id')));

    readonly personDetails = computed(() => this.profiles.details(this.person()));
    readonly familyNucleus = computed(() => this.profiles.family(this.person()));
    readonly history = computed(() => this.profiles.history(this.person()));

    // Avviso "token esauriti": la persona ha hasTokens = false
    public readonly isTokensDepleted = computed(() => this.person()?.hasTokens === false);

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

    // Richiesta di token in attesa per QUESTA persona, dai dati condivisi (non da una variabile locale)
    readonly pendingRequest = computed(() => this.backend.pendingTokenRequestForBeneficiary(this.person()?.id));

    // Testo della barra informativa, con data e ora reali registrate nella richiesta
    readonly sentMessage = computed(() => {
        const request = this.pendingRequest();
        if (!request) return '';
        const date = new Date(request.date);
        const day = date.toLocaleDateString('it-IT');
        const time = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        return `Richiesta inviata all'Admin il ${day} alle ${time}`;
    });

    /**
     * "Richiedi token": salva la richiesta nei dati condivisi (la vede l'Admin della sede in Richieste).
     * Resta in questa pagina. La barra "Richiesta inviata" compare solo a salvataggio riuscito,
     * perché dipende dalla richiesta salvata; se fallisce: banner di errore e pulsante di nuovo attivo.
     */
    async requestTokens(): Promise<void> {
        const person = this.person();
        if (!person || this.isSending() || this.pendingRequest()) return;

        this.isSending.set(true);
        try {
            await this.backend.requestTokenExtra(person.id);
        } catch {
            this.notifications.error('Errore durante l\'invio della richiesta. Riprova.');
        } finally {
            this.isSending.set(false);
        }
    }
}
