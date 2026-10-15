import { Injectable, computed, effect, signal } from '@angular/core';

// =====================================================================
// TIPI (gli "stampi" dei dati)
// =====================================================================

export type Role = 'operatore' | 'responsabile';
export type ProductCategory = 'Pasta' | 'Omogeneizzati' | 'Carne' | 'Verdura' | 'Altro';
export type MeasurementUnit = 'Kg' | 'Litro' | 'Sacco' | 'Pacco' | 'Scatola';
export type BeneficiaryStatus = 'Attivo' | 'Sospeso' | 'Scaduto';
export type DeliveryStatus = 'Completata' | 'Sospesa' | 'Annullata';
export type AlertDecision = 'In attesa' | 'Sospesa' | 'Annullata' | 'Confermata';
export type ApprovalType = 'Nuovo beneficiario' | 'Token extra' | 'Riordino';
export type ApprovalStatus = 'In attesa' | 'Approvata' | 'Rifiutata';
export type ShipmentStatus = 'Ordinato' | 'In transito' | 'Arrivato';

export interface Site {
    id: string;
    name: string;
    type: 'Metro' | 'EnteDistributore';
    address: string;
    city: string;
    province: string;
}

export interface Operator {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    siteId: string;      // punto di distribuzione associato
    role: Role;
}

/** Operatore SENZA password: è l'unica versione che esce dal service */
export type SafeOperator = Omit<Operator, 'password'>;

export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    unit: MeasurementUnit;
    icon: 'bag' | 'bottle' | 'meat';
    stock: number;
    minStock: number;
    price: number;
    expiry: string;              // 'YYYY-MM-DD'
    maxPerBeneficiary: number;
}

export interface Beneficiary {
    id: string;
    code: string;                // identificativo univoco (QR / ricerca)
    firstName: string;
    lastName: string;
    taxCode: string;
    birthDate: string;
    address: string;
    hasAllergies: boolean;
    hasIntolerances: boolean;
    status: BeneficiaryStatus;
    adults: number;
    minors: number;
    tokens: number;
}

/** Dati minimi mostrati nei risultati di ricerca (privacy) */
export type BeneficiarySummary = Pick<Beneficiary, 'id' | 'code' | 'firstName' | 'lastName' | 'status'>;

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface DeliveryItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Delivery {
    id: string;
    beneficiaryId: string;
    operatorId: string;
    siteId: string;
    date: string;                // ISO completo
    items: DeliveryItem[];
    tokensUsed: number;
    status: DeliveryStatus;
    alertId?: string;            // presente se la consegna ha generato un alert
}

/** Quello che arriva dal form di registrazione consegna */
export interface DeliveryDraft {
    beneficiaryId: string;
    siteId: string;
    date: string;                // 'YYYY-MM-DD'
    items: CartItem[];
}

/** Un possibile duplicato trovato */
export interface DuplicateWarning {
    productId: string;
    productName: string;
    previousDeliveryId: string;
    previousDate: string;
    previousSiteName: string;
    daysAgo: number;
}

/** Alert con la traccia della decisione dell'operatore */
export interface DeliveryAlert {
    id: string;
    beneficiaryId: string;
    deliveryId: string;
    warnings: DuplicateWarning[];
    createdAt: string;
    decision: AlertDecision;
    reason?: string;
    decidedBy?: string;
    decidedAt?: string;
}

/** Risposta di registerDelivery: alert = null se tutto ok */
export interface RegisterDeliveryResult {
    delivery: Delivery;
    alert: DeliveryAlert | null;
}

export interface ApprovalRequest {
    id: string;
    type: ApprovalType;
    description: string;
    requestedBy: string;
    date: string;
    status: ApprovalStatus;
    beneficiaryId?: string;
    extraTokens?: number;
    productId?: string;
    quantity?: number;
    decidedBy?: string;
    decidedAt?: string;
}

export interface Shipment {
    id: string;
    trackingNumber: string;
    fromSiteId: string;
    toSiteId: string;
    items: CartItem[];
    status: ShipmentStatus;
    createdAt: string;
    arrivedAt?: string;
}





// =====================================================================
// COSTANTI E DATI INIZIALI (il "finto database")
// =====================================================================

const TOKENS_PER_ADULTI = 250;
const TOKENS_PER_MINORI = 75;
const EXPIRY_WARNING_DAYS = 14;
const DEFAULT_DUPLICATE_WINDOW_DAYS = 30;   // finestra duplicati configurabile
const FAKE_API_DELAY_MS = 600;              // finto tempo di risposta dell'API
const METRO_SITE_ID = 's-metro';
const DEFAULT_SITE_ID = 's-legnano';
const MS_PER_DAY = 86_400_000;
const STORAGE_PREFIX = 'cri_';              // prefisso delle chiavi nel localStorage


const SEED_SITES: Site[] = [
    { id: 's-metro', name: 'Metro Milano', type: 'Metro', address: 'Via Fantoli 1', city: 'Milano', province: 'MI' },
    { id: 's-legnano', name: 'Negozio Legnano', type: 'EnteDistributore', address: 'Via Gilardelli', city: 'Legnano', province: 'MI' },
    { id: 's-parabiago', name: 'Parabiago', type: 'EnteDistributore', address: 'Via Santa Maria 10', city: 'Parabiago', province: 'MI' },
];

// Password in chiaro SOLO perché sono dati finti per la demo
const SEED_OPERATORS: Operator[] = [
    { id: 'op-1', username: 'm.turelli', password: 'password', firstName: 'Marco', lastName: 'Turelli', email: 'm.turelli@cri.it', siteId: 's-legnano', role: 'operatore' },
    { id: 'op-2', username: 'i.dimarco', password: 'password', firstName: 'Ilaria', lastName: 'Di Marco', email: 'ilariadimarco@hotmail.com', siteId: 's-legnano', role: 'responsabile' },
    { id: 'op-3', username: 'a.carraro', password: 'password', firstName: 'Alessio', lastName: 'Carraro', email: 'alessiocarraro@hotmail.com', siteId: 's-parabiago', role: 'operatore' },
    { id: 'op-4', username: 'n.turelli', password: 'password', firstName: 'Nicole', lastName: 'Turelli', email: 'nicoleturelli@hotmail.com', siteId: 's-legnano', role: 'operatore' },
];

const SEED_PRODUCTS: Product[] = [
    { id: 'p-1', name: 'Pasta di semola 500g', category: 'Pasta', unit: 'Pacco', icon: 'bag', stock: 420, minStock: 50, price: 20, expiry: '2027-05-15', maxPerBeneficiary: 5 },
    { id: 'p-2', name: 'Pasta integrale 500g', category: 'Pasta', unit: 'Pacco', icon: 'bag', stock: 58, minStock: 60, price: 22, expiry: '2026-10-25', maxPerBeneficiary: 3 },
    { id: 'p-3', name: 'Passata di pomodoro 700g', category: 'Verdura', unit: 'Scatola', icon: 'bottle', stock: 300, minStock: 40, price: 15, expiry: '2027-08-20', maxPerBeneficiary: 4 },
    { id: 'p-4', name: 'Petto di pollo 1kg', category: 'Carne', unit: 'Kg', icon: 'meat', stock: 25, minStock: 30, price: 40, expiry: '2026-10-20', maxPerBeneficiary: 2 },
    { id: 'p-5', name: 'Omogeneizzato carne', category: 'Omogeneizzati', unit: 'Scatola', icon: 'bottle', stock: 0, minStock: 20, price: 12, expiry: '2027-01-10', maxPerBeneficiary: 6 },
];

const SEED_BENEFICIARIES: Beneficiary[] = [
    { id: 'b-1', code: 'ID-2024-0481', firstName: 'Mario', lastName: 'Rossi', taxCode: 'RSSMRA82C14F205X', birthDate: '1982-03-14', address: 'Via Roma 24, Legnano (MI)', hasAllergies: false, hasIntolerances: false, status: 'Attivo', adults: 2, minors: 1, tokens: 420 },
    { id: 'b-2', code: 'ID-2024-0502', firstName: 'Pietro', lastName: 'Moretti', taxCode: 'MRTPTR90A01F205Y', birthDate: '1990-01-01', address: 'Via Milano 3, Legnano (MI)', hasAllergies: true, hasIntolerances: false, status: 'Attivo', adults: 1, minors: 0, tokens: 250 },
    { id: 'b-3', code: 'ID-2024-0517', firstName: 'Alessandro', lastName: 'Fina', taxCode: 'FNILSN85B02F205Z', birthDate: '1985-02-02', address: 'Via Verdi 8, Parabiago (MI)', hasAllergies: false, hasIntolerances: true, status: 'Sospeso', adults: 2, minors: 2, tokens: 0 },
    { id: 'b-4', code: 'ID-2024-0533', firstName: 'Simone', lastName: 'Ruggeri', taxCode: 'RGGSMN95C03F205W', birthDate: '1995-03-03', address: 'Via Dante 12, Legnano (MI)', hasAllergies: false, hasIntolerances: false, status: 'Scaduto', adults: 1, minors: 1, tokens: 0 },
];

const SEED_DELIVERIES: Delivery[] = [
    {
        id: 'd-1', beneficiaryId: 'b-1', operatorId: 'op-4', siteId: 's-legnano', date: '2026-10-03T10:30:00.000Z', tokensUsed: 95, status: 'Completata',
        items: [{ productId: 'p-1', name: 'Pasta di semola 500g', quantity: 2, price: 20 }, { productId: 'p-3', name: 'Passata di pomodoro 700g', quantity: 1, price: 15 }, { productId: 'p-4', name: 'Petto di pollo 1kg', quantity: 1, price: 40 }]
    },
    {
        id: 'd-2', beneficiaryId: 'b-1', operatorId: 'op-3', siteId: 's-parabiago', date: '2026-09-14T09:00:00.000Z', tokensUsed: 60, status: 'Completata',
        items: [{ productId: 'p-1', name: 'Pasta di semola 500g', quantity: 3, price: 20 }]
    },
];

const SEED_ALERTS: DeliveryAlert[] = [];

const SEED_APPROVALS: ApprovalRequest[] = [
    { id: 'a-1', type: 'Nuovo beneficiario', description: 'Attivazione Alessandro Fina (nucleo 2+2)', requestedBy: 'op-2', date: '2026-10-14T15:00:00.000Z', status: 'In attesa', beneficiaryId: 'b-3' },
    { id: 'a-2', type: 'Token extra', description: '+50 token per Mario Rossi (spesa medica)', requestedBy: 'op-1', date: '2026-10-15T08:30:00.000Z', status: 'In attesa', beneficiaryId: 'b-1', extraTokens: 50 },
    { id: 'a-3', type: 'Riordino', description: 'Riordino 100 Omogeneizzato carne', requestedBy: 'op-1', date: '2026-10-15T09:00:00.000Z', status: 'In attesa', productId: 'p-5', quantity: 100 },
];

const SEED_SHIPMENTS: Shipment[] = [
    { id: 'sh-1', trackingNumber: 'TRK-100231', fromSiteId: 's-metro', toSiteId: 's-legnano', items: [{ productId: 'p-2', quantity: 120 }], status: 'In transito', createdAt: '2026-10-13T08:00:00.000Z' },
    { id: 'sh-2', trackingNumber: 'TRK-100245', fromSiteId: 's-metro', toSiteId: 's-legnano', items: [{ productId: 'p-4', quantity: 40 }], status: 'Ordinato', createdAt: '2026-10-15T07:00:00.000Z' },
];




// =====================================================================
// CLASSE E STATO
// =====================================================================

@Injectable({ providedIn: 'root' })
export class MockBackendService {
    // ----- STATO PRIVATO (caricato dal localStorage se presente) -----
    private readonly _sites = signal<Site[]>(SEED_SITES);
    private readonly _operators = signal<Operator[]>(SEED_OPERATORS);
    private readonly _products = signal<Product[]>(this.load('products', SEED_PRODUCTS));
    private readonly _beneficiaries = signal<Beneficiary[]>(this.load('beneficiaries', SEED_BENEFICIARIES));
    private readonly _deliveries = signal<Delivery[]>(this.load('deliveries', SEED_DELIVERIES));
    private readonly _alerts = signal<DeliveryAlert[]>(this.load('alerts', SEED_ALERTS));
    private readonly _approvals = signal<ApprovalRequest[]>(this.load('approvals', SEED_APPROVALS));
    private readonly _shipments = signal<Shipment[]>(this.load('shipments', SEED_SHIPMENTS));
    private readonly _duplicateWindowDays = signal<number>(this.load('duplicateWindow', DEFAULT_DUPLICATE_WINDOW_DAYS));

    // ----- STATO DELLA SESSIONE -----
    private readonly _currentOperatorId = signal<string | null>(this.load<string | null>('operatorId', null));
    private readonly _selectedBeneficiaryId = signal<string | null>(null);
    private readonly _cart = signal<CartItem[]>([]);
    private readonly _lastDelivery = signal<Delivery | null>(null);
    private readonly _serviceDown = signal(false);

    // ----- STATO PUBBLICO (sola lettura) -----
    readonly sites = this._sites.asReadonly();
    readonly products = this._products.asReadonly();
    readonly deliveries = this._deliveries.asReadonly();
    readonly alerts = this._alerts.asReadonly();
    readonly approvals = this._approvals.asReadonly();
    readonly shipments = this._shipments.asReadonly();
    readonly duplicateWindowDays = this._duplicateWindowDays.asReadonly();
    readonly cart = this._cart.asReadonly();
    readonly lastDelivery = this._lastDelivery.asReadonly();
    readonly serviceDown = this._serviceDown.asReadonly();

    readonly currentOperator = computed<SafeOperator | null>(() => {
        const op = this._operators().find(o => o.id === this._currentOperatorId());
        return op ? this.toSafe(op) : null;
    });

    readonly isLoggedIn = computed(() => this.currentOperator() !== null);

    readonly currentSite = computed<Site | null>(() => {
        const op = this.currentOperator();
        return op ? this._sites().find(s => s.id === op.siteId) ?? null : null;
    });

    // ----- SALVATAGGIO AUTOMATICO NEL LOCALSTORAGE -----
    constructor() {
        effect(() => this.save('products', this._products()));
        effect(() => this.save('beneficiaries', this._beneficiaries()));
        effect(() => this.save('deliveries', this._deliveries()));
        effect(() => this.save('alerts', this._alerts()));
        effect(() => this.save('approvals', this._approvals()));
        effect(() => this.save('shipments', this._shipments()));
        effect(() => this.save('duplicateWindow', this._duplicateWindowDays()));
        effect(() => this.save('operatorId', this._currentOperatorId()));
    }



    // =====================================================================
    // HELPER (attrezzi usati da tutti)
    // =====================================================================

    private newId(): string {
        return crypto.randomUUID();
    }

    private nowIso(): string {
        return new Date().toISOString();
    }

    todayIso(): string {
        return this.nowIso().slice(0, 10);
    }

    /** Giorni tra due date (conta solo il giorno, non l'ora) */
    daysBetween(fromIso: string, toIso: string): number {
        const from = new Date(fromIso.slice(0, 10)).getTime();
        const to = new Date(toIso.slice(0, 10)).getTime();
        return Math.round((to - from) / MS_PER_DAY);
    }

    /** Giorni che mancano a una data (negativo = già passata) */
    daysUntil(isoDate: string): number {
        return this.daysBetween(this.todayIso(), isoDate);
    }

    getSiteName(siteId: string): string {
        return this._sites().find(s => s.id === siteId)?.name ?? '—';
    }

    getOperatorName(operatorId: string): string {
        const o = this._operators().find(op => op.id === operatorId);
        return o ? `${o.firstName.charAt(0)}. ${o.lastName}` : '—';
    }

    getProduct(productId: string): Product | undefined {
        return this._products().find(p => p.id === productId);
    }

    /** Toglie la password prima di dare l'operatore alle pagine */
    private toSafe(op: Operator): SafeOperator {
        const { password, ...safe } = op; // "password" viene scartata
        return safe;
    }

    // ----- localStorage -----
    private load<T>(key: string, fallback: T): T {
        try {
            const raw = localStorage.getItem(STORAGE_PREFIX + key);
            return raw ? (JSON.parse(raw) as T) : fallback;
        } catch {
            return fallback;
        }
    }

    private save(key: string, value: unknown): void {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        } catch {
            // se il browser blocca lo storage, si continua solo in memoria
        }
    }

    // ----- Finta API -----
    /** Simula una chiamata API: aspetta, poi esegue oppure lancia un errore */
    private async fakeApi<T>(work: () => T, delayMs: number = FAKE_API_DELAY_MS): Promise<T> {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        if (this._serviceDown()) {
            throw new Error('Servizio non disponibile. Riprova più tardi.');
        }
        return work();
    }

    // ----- Permessi -----
    private requireLogin(): Operator {
        const op = this._operators().find(o => o.id === this._currentOperatorId());
        if (!op) throw new Error('Sessione scaduta: effettua di nuovo il login');
        return op;
    }

    private requireRole(role: Role): Operator {
        const op = this.requireLogin();
        if (op.role !== role) throw new Error('Autorizzazione insufficiente');
        return op;
    }

    // ----- Strumenti per la demo -----
    /** Attiva/disattiva il finto "servizio non disponibile" */
    setServiceDown(down: boolean): void {
        this._serviceDown.set(down);
    }

    /** Riporta tutti i dati allo stato iniziale */
    resetDemoData(): void {
        const keys = ['products', 'beneficiaries', 'deliveries', 'alerts', 'approvals', 'shipments', 'duplicateWindow', 'operatorId'];
        for (const key of keys) {
            try { localStorage.removeItem(STORAGE_PREFIX + key); } catch { /* ignorato */ }
        }
        this._products.set(SEED_PRODUCTS);
        this._beneficiaries.set(SEED_BENEFICIARIES);
        this._deliveries.set(SEED_DELIVERIES);
        this._alerts.set(SEED_ALERTS);
        this._approvals.set(SEED_APPROVALS);
        this._shipments.set(SEED_SHIPMENTS);
        this._duplicateWindowDays.set(DEFAULT_DUPLICATE_WINDOW_DAYS);
        this._currentOperatorId.set(null);
        this._selectedBeneficiaryId.set(null);
        this._cart.set([]);
        this._lastDelivery.set(null);
    }


    // =====================================================================
    // ACCESSO
    // =====================================================================

    async login(username: string, password: string): Promise<SafeOperator> {
        return this.fakeApi(() => {
            if (!username.trim() || !password) {
                throw new Error('Inserisci nome utente e password');
            }
            const op = this._operators().find(o => o.username.toLowerCase() === username.trim().toLowerCase());
            if (!op || op.password !== password) {
                throw new Error('Credenziali non valide');
            }
            this._currentOperatorId.set(op.id);
            this._selectedBeneficiaryId.set(null);
            this._cart.set([]);
            return this.toSafe(op);
        });
    }

    logout(): void {
        this._currentOperatorId.set(null);
        this._selectedBeneficiaryId.set(null);
        this._cart.set([]);
        this._lastDelivery.set(null);
    }

  // =====================================================================
  // BENEFICIARI
  // =====================================================================

  
}