import { Injectable, computed, effect, signal } from '@angular/core';

// ==========================================
// 1. INTERFACCE E TIPI (Gli "stampi" dei dati)
// ==========================================

export type Role = 'Operator' | 'S-Admin' | 'User' | 'Admin';
export type ProductCategory = 'Pasta' | 'Omogeneizzati' | 'Carne' | 'Verdura' | 'Altro';
export type MeasurementUnit = 'Kg' | 'Litro' | 'Sacco' | 'Pacco' | 'Scatola';
export type BeneficiaryStatus = 'Attivo' | 'Sospeso' | 'Scaduto';
export type DeliveryStatus = 'Completata' | 'Sospesa' | 'Annullata';
export type AlertDecision = 'In attesa' | 'Sospesa' | 'Annullata' | 'Confermata';
export type ApprovalType = 'Nuovo beneficiario' | 'Token extra' | 'Riordino';
export type ApprovalStatus = 'In attesa' | 'Approvata' | 'Rifiutata';
export type RequestStatus = 'In attesa' | 'Approvata' | 'Rifiutata';
export type ShipmentStatus = 'Ordinato' | 'In transito' | 'Arrivato';


export interface Site {
    id: string; // Primary key (UUID)
    name: string;
    type: 'Metro' | 'EnteDistributore';
    address: string;
    city: string;
    province: string;
}

export interface Operator {
    id: string; // Primary key (UUID)
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    siteId: string; // Foreign key (UUID)     // punto di distribuzione associato
    role: Role;
}

/** Operatore SENZA password: è l'unica versione che esce dal service */
export type SafeOperator = Omit<Operator, 'password'>;

export interface ProductRequest {
    id: string; // Primary key (UUID)
    productId: string; // Foreign key (UUID)
    operatorId: string; // Foreign key (UUID)
    siteId: string; // Foreign key (UUID)
    timestamp: Date;
    status: RequestStatus;
}

export interface Product {
    id: string; // Primary key (UUID)
    name: string;
    category: ProductCategory;
    unit: MeasurementUnit;
    icon: 'bag' | 'bottle' | 'meat';
    stock: number;
    minStock: number;
    isOutOfStock: boolean;
    price: number;
    expiry: string;              // 'YYYY-MM-DD'
    isExpiringSoon: boolean;
    isExpired: boolean;
    maxPerBeneficiary: number;
    iconType: 'bag' | 'meat' | 'jar';
}

export interface SiteInventory {
    siteId: string;
    productId: string;
    productName: string;
    weight: string;
    stock: number;
    expiry: string; // 'YYYY-MM-DD'
    isExpiringSoon: boolean;
    isExpired: boolean;
}

export interface StoreAvailabilityResult {
    siteId: string;
    siteName: string;
    stock: number;
    distance: string;
}

export interface Beneficiary {
    id: string; // Primary key (UUID)
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
    hasTokens: boolean;
}

/** Dati minimi mostrati nei risultati di ricerca (privacy) */
export type BeneficiarySummary = Pick<Beneficiary, 'id' | 'code' | 'firstName' | 'lastName' | 'status'>;

export interface CartItem {
    productId: string; // Foreign key (UUID)
    quantity: number;
}

export interface DeliveryItem {
    productId: string; // Foreign key (UUID)
    name: string;
    quantity: number;
    price: number;
}

export interface Delivery {
    id: string; // Primary key (UUID)
    beneficiaryId: string; // Foreign key (UUID)
    operatorId: string; // Foreign key (UUID)
    siteId: string; // Foreign key (UUID)
    date: string;                // ISO completo
    items: DeliveryItem[];
    tokensUsed: number;
    status: DeliveryStatus;
    alertId?: string;            // presente se la consegna ha generato un alert
}

/** Quello che arriva dal form di registrazione consegna */
export interface DeliveryDraft {
    beneficiaryId: string; // Foreign key (UUID)
    siteId: string; // Foreign key (UUID)
    date: string;                // 'YYYY-MM-DD'
    items: CartItem[];
}

/** Un possibile duplicato trovato */
export interface DuplicateWarning {
    productId: string; // Foreign key (UUID)
    productName: string;
    previousDeliveryId: string; // Foreign key (UUID)
    previousDate: string;
    previousSiteName: string;
    daysAgo: number;
}

/** Alert con la traccia della decisione dell'operatore */
export interface DeliveryAlert {
    id: string; // Primary key (UUID)
    beneficiaryId: string; // Foreign key (UUID)
    deliveryId: string; // Foreign key (UUID)
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
    id: string; // Primary key (UUID)
    type: ApprovalType;
    description: string;
    requestedBy: string; // Foreign key (UUID)
    date: string;
    status: ApprovalStatus;
    beneficiaryId?: string; // Foreign key (UUID)
    extraTokens?: number;
    productId?: string; // Foreign key (UUID)
    quantity?: number;
    decidedBy?: string; // Foreign key (UUID)
    decidedAt?: string;
}

export interface Shipment {
    id: string; // Primary key (UUID)
    trackingNumber: string;
    fromSiteId: string; // Foreign key (UUID)
    toSiteId: string; // Foreign key (UUID)
    items: CartItem[];
    status: ShipmentStatus;
    createdAt: string;
    arrivedAt?: string;
}

// COSTANTI E DATI INIZIALI (il "finto database")

const TOKENS_PER_ADULTI = 250;
const TOKENS_PER_MINORI = 75;
const EXPIRY_WARNING_DAYS = 14;
const DEFAULT_DUPLICATE_WINDOW_DAYS = 30;   // finestra duplicati configurabile
const FAKE_API_DELAY_MS = 600;              // finto tempo di risposta dell'API
const METRO_SITE_ID = '96996a93-e59e-4fc6-91f3-99972fd6d977';
const DEFAULT_SITE_ID = '4e81f18f-a6af-45a9-adbe-d82dd95d6b44';
const MS_PER_DAY = 86_400_000;
const STORAGE_PREFIX = 'cri_';              // prefisso delle chiavi nel localStorage

export const SEED_SITES: Site[] = [
    { id: '96996a93-e59e-4fc6-91f3-99972fd6d977', name: 'Metro Milano', type: 'Metro', address: 'Via Fantoli 1', city: 'Milano', province: 'MI' },
    {
        id: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', name: 'Negozio Legnano', type: 'EnteDistributore', address: 'Via Gilardelli', city: 'Legnano',
        province: 'MI'
    },
    {
        id: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f', name: 'Parabiago', type: 'EnteDistributore', address: 'Via Santa Maria 10', city: 'Parabiago',
        province: 'MI'
    },
    {
        id: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', name: 'Busto Arsizio', type: 'EnteDistributore', address: 'Via Santa Maria 10', city: 'Busto Arsizio',
        province: 'MI'
    },
];

// Password in chiaro SOLO perché sono dati finti per la demo
export const SEED_OPERATORS: Operator[] = [
    {
        id: 'f60715f5-0569-44c2-8170-eadcad14a1f7', username: 'm.turelli', password: 'password', firstName: 'Marco', lastName: 'Turelli',
        email: 'm.turelli@cri.it', siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', role: 'S-Admin'
    },
    {
        id: 'aa7d2f69-056e-4cbc-9236-c72bb5303c1f', username: 'i.dimarco', password: 'password', firstName: 'Ilaria', lastName: 'Di Marco',
        email: 'ilariadimarco@hotmail.com', siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', role: 'Admin'
    },
    {
        id: 'd34dfbfe-45a9-4b67-8d03-c99d7fa4a4b5', username: 'a.carraro', password: 'password', firstName: 'Alessio', lastName: 'Carraro',
        email: 'alessiocarraro@hotmail.com', siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', role: 'Operator'
    },
    {
        id: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2', username: 'n.turelli', password: 'password', firstName: 'Nicole', lastName: 'Turelli',
        email: 'nicoleturelli@hotmail.com', siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', role: 'User'
    },
    {
        id: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2', username: 'n.turelli', password: 'password', firstName: 'Nicole', lastName: 'Turelli',
        email: 'nicoleturelli@hotmail.com', siteId: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f', role: 'User'
    },
];

export const SEED_PRODUCTS: Product[] = [
    {
        id: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', name: 'Pasta di semola 500g', category: 'Pasta', unit: 'Pacco', icon: 'bag', stock: 420,
        minStock: 50, isOutOfStock: false, price: 20, expiry: '2027-05-15', isExpiringSoon: false, isExpired: false, maxPerBeneficiary: 5,
        iconType: 'bag'
    },
    {
        id: 'edff434d-ceab-490a-9bba-b47366139ce2', name: 'Pasta integrale 500g', category: 'Pasta', unit: 'Pacco', icon: 'bag', stock: 58,
        minStock: 60, isOutOfStock: false, price: 22, expiry: '2026-10-25', isExpiringSoon: false, isExpired: false, maxPerBeneficiary: 3,
        iconType: 'bag'
    },
    {
        id: '4396be27-f626-4032-8db2-18cbbb56d26a', name: 'Passata di pomodoro 700g', category: 'Verdura', unit: 'Scatola', icon: 'bottle', stock: 300,
        minStock: 40, isOutOfStock: false, price: 15, expiry: '2027-08-20', isExpiringSoon: true, isExpired: false, maxPerBeneficiary: 4,
        iconType: 'bag'
    },
    {
        id: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', name: 'Petto di pollo 1kg', category: 'Carne', unit: 'Kg', icon: 'meat', stock: 25,
        minStock: 30, isOutOfStock: false, price: 40, expiry: '2026-10-20', isExpiringSoon: true, isExpired: false, maxPerBeneficiary: 2,
        iconType: 'meat'
    },
    {
        id: '61321c12-9f01-4493-95f6-e7406296257b', name: 'Omogeneizzato carne', category: 'Omogeneizzati', unit: 'Scatola', icon: 'bottle', stock: 0,
        minStock: 20, isOutOfStock: true, price: 12, expiry: '2027-01-10', isExpiringSoon: false, isExpired: true, maxPerBeneficiary: 6,
        iconType: 'jar'
    },
];

export const SEED_INVENTORIES: SiteInventory[] = [
    // Sede Legnano
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', productName: 'Pasta penne', weight: '500g', stock: 120, expiry: '2027-05-15', isExpiringSoon: false, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: 'edff434d-ceab-490a-9bba-b47366139ce2', productName: 'Pasta spaghetti', weight: '500g', stock: 18, expiry: '2026-10-25', isExpiringSoon: false, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: '4396be27-f626-4032-8db2-18cbbb56d26a', productName: 'Petto di pollo', weight: '450g', stock: 1, expiry: '2027-08-20', isExpiringSoon: true, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', productName: 'Biscotti Galleltti', weight: '1Kg', stock: 4, expiry: '2026-10-20', isExpiringSoon: true, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: '61321c12-9f01-4493-95f6-e7406296257b', productName: 'Risco Basmati', weight: '500g', stock: 2, expiry: '2027-01-10', isExpiringSoon: false, isExpired: true },

    // Sede Busto Arsizio
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', productName: 'Pasta penne', weight: '500g', stock: 100, expiry: '2027-05-15', isExpiringSoon: false, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: 'edff434d-ceab-490a-9bba-b47366139ce2', productName: 'Pasta spaghetti', weight: '500g', stock: 20, expiry: '2026-10-25', isExpiringSoon: false, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: '4396be27-f626-4032-8db2-18cbbb56d26a', productName: 'Petto di pollo', weight: '450g', stock: 1, expiry: '2027-08-20', isExpiringSoon: true, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', productName: 'Biscotti Galleltti', weight: '1Kg', stock: 25, expiry: '2026-10-20', isExpiringSoon: true, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: '61321c12-9f01-4493-95f6-e7406296257b', productName: 'Risco Basmati', weight: '500g', stock: 2, expiry: '2027-01-10', isExpiringSoon: false, isExpired: true },

    // Metro
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', productName: 'Pasta penne', weight: '500g', stock: 420, expiry: '2027-05-15', isExpiringSoon: false, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: 'edff434d-ceab-490a-9bba-b47366139ce2', productName: 'Pasta spaghetti', weight: '500g', stock: 58, expiry: '2026-10-25', isExpiringSoon: false, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: '4396be27-f626-4032-8db2-18cbbb56d26a', productName: 'Petto di pollo', weight: '450g', stock: 5, expiry: '2027-08-20', isExpiringSoon: true, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', productName: 'Biscotti Galleltti', weight: '1Kg', stock: 25, expiry: '2026-10-20', isExpiringSoon: true, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: '61321c12-9f01-4493-95f6-e7406296257b', productName: 'Risco Basmati', weight: '500g', stock: 2, expiry: '2027-01-10', isExpiringSoon: false, isExpired: true },
];

export const SEED_BENEFICIARIES: Beneficiary[] = [
    {
        id: '4c3e3adf-b60e-4187-b1f5-4ad73b13dd06', code: 'ID-2024-0481', firstName: 'Mario', lastName: 'Rossi', taxCode: 'RSSMRA82C14F205X',
        birthDate: '1982-03-14', address: 'Via Roma 24, Legnano (MI)', hasAllergies: false, hasIntolerances: false, status: 'Attivo', adults: 2,
        minors: 1, tokens: 420, hasTokens: true
    },
    {
        id: '343f5707-a16f-4995-9e40-790e80226260', code: 'ID-2024-0502', firstName: 'Pietro', lastName: 'Moretti', taxCode: 'MRTPTR90A01F205Y',
        birthDate: '1990-01-01', address: 'Via Milano 3, Legnano (MI)', hasAllergies: true, hasIntolerances: false, status: 'Attivo', adults: 1,
        minors: 0, tokens: 250, hasTokens: true
    },
    {
        id: '912cd7e0-b935-42c0-a607-2b38c255656a', code: 'ID-2024-0517', firstName: 'Alessandro', lastName: 'Fina', taxCode: 'FNILSN85B02F205Z',
        birthDate: '1985-02-02', address: 'Via Verdi 8, Parabiago (MI)', hasAllergies: false, hasIntolerances: true, status: 'Sospeso', adults: 2,
        minors: 2, tokens: 0, hasTokens: false
    },
    {
        id: '67e15eef-ffdf-4b15-bf45-eba71d9cf2d6', code: 'ID-2024-0533', firstName: 'Simone', lastName: 'Ruggeri', taxCode: 'RGGSMN95C03F205W',
        birthDate: '1995-03-03', address: 'Via Dante 12, Legnano (MI)', hasAllergies: false, hasIntolerances: false, status: 'Scaduto', adults: 1,
        minors: 1, tokens: 0, hasTokens: false
    },
];

export const SEED_DELIVERIES: Delivery[] = [
    {
        id: '6bc73b93-cc36-4295-9a9e-482fd1e995b3', beneficiaryId: '4c3e3adf-b60e-4187-b1f5-4ad73b13dd06',
        operatorId: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2', siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', date: '2026-10-03T10:30:00.000Z',
        tokensUsed: 95, status: 'Completata',
        items: [
            { productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', name: 'Pasta di semola 500g', quantity: 2, price: 20 },
            { productId: '4396be27-f626-4032-8db2-18cbbb56d26a', name: 'Passata di pomodoro 700g', quantity: 1, price: 15 },
            { productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', name: 'Petto di pollo 1kg', quantity: 1, price: 40 }
        ]
    },
    {
        id: 'b611df33-5cea-459a-8126-03829074d179', beneficiaryId: '912cd7e0-b935-42c0-a607-2b38c255656a',
        operatorId: 'aa7d2f69-056e-4cbc-9236-c72bb5303c1f', siteId: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f', date: '2026-09-14T09:00:00.000Z',
        tokensUsed: 60, status: 'Completata',
        items: [
            { productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', name: 'Pasta di semola 500g', quantity: 3, price: 20 }
        ]
    },
];

export const SEED_ALERTS: DeliveryAlert[] = [];

export const SEED_APPROVALS: ApprovalRequest[] = [
    // {
    //     id: '88ee93f5-68e8-41cb-8e3e-7ffcc08ee131', type: 'Nuovo beneficiario', description: 'Attivazione Alessandro Fina (nucleo 2+2)',
    //     requestedBy: 'oedff434d-ceab-490a-9bba-b47366139ce2', date: '2026-10-14T15:00:00.000Z', status: 'In attesa', beneficiaryId: '912cd7e0-b935-42c0-a607-2b38c255656a'
    // },
    {
        id: '7fc5855a-0f28-460d-92df-9f19498bc74f', type: 'Token extra', description: '+50 token per Mario Rossi (spesa medica)',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2', date: '2026-10-15T08:30:00.000Z', status: 'In attesa',
        beneficiaryId: '4c3e3adf-b60e-4187-b1f5-4ad73b13dd06', extraTokens: 50
    },
    {
        id: '50890db5-6695-4b49-800c-ca17486ca1c8', type: 'Riordino', description: 'Riordino 100 Omogeneizzato carne',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2', date: '2026-10-15T09:00:00.000Z', status: 'In attesa',
        productId: '61321c12-9f01-4493-95f6-e7406296257b', quantity: 100
    },
];

export const SEED_SHIPMENTS: Shipment[] = [
    {
        id: 'ee0b158f-f098-4afe-b907-b72f4565beec', trackingNumber: 'TRK-100231', fromSiteId: '96996a93-e59e-4fc6-91f3-99972fd6d977',
        toSiteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44',
        items: [
            { productId: 'edff434d-ceab-490a-9bba-b47366139ce2', quantity: 120 }
        ],
        status: 'In transito', createdAt: '2026-10-13T08:00:00.000Z'
    },
    {
        id: '65b94b3e-50de-48ce-a40d-b580e5629427', trackingNumber: 'TRK-100245', fromSiteId: '96996a93-e59e-4fc6-91f3-99972fd6d977',
        toSiteId: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f',
        items: [
            { productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', quantity: 40 }
        ],
        status: 'Ordinato', createdAt: '2026-10-15T07:00:00.000Z'
    },
];

// ==========================================
// 3. CLASSE DEL SERVICE (MockBackendService)
// ==========================================

@Injectable({ providedIn: 'root' })
export class MockBackendService {
    // Stato privato basato su Signals e localStorage
    private readonly _sites = signal<Site[]>(SEED_SITES);
    private readonly _operators = signal<Operator[]>(SEED_OPERATORS);
    private readonly _products = signal<Product[]>(this.load('products', SEED_PRODUCTS));
    private readonly _beneficiaries = signal<Beneficiary[]>(this.load('beneficiaries', SEED_BENEFICIARIES));
    private readonly _deliveries = signal<Delivery[]>(this.load('deliveries', SEED_DELIVERIES));
    private readonly _alerts = signal<DeliveryAlert[]>(this.load('alerts', SEED_ALERTS));
    private readonly _approvals = signal<ApprovalRequest[]>(this.load('approvals', SEED_APPROVALS));
    private readonly _shipments = signal<Shipment[]>(this.load('shipments', SEED_SHIPMENTS));
    private readonly _duplicateWindowDays = signal<number>(this.load('duplicateWindow', DEFAULT_DUPLICATE_WINDOW_DAYS));

    // Stato della sessione
    private readonly _currentOperatorId = signal<string | null>(this.load<string | null>('operatorId', null));
    private readonly _selectedBeneficiaryId = signal<string | null>(null);
    private readonly _cart = signal<CartItem[]>([]);
    private readonly _lastDelivery = signal<Delivery | null>(null);
    private readonly _serviceDown = signal(false);

    // Stato pubblico in sola lettura
    readonly sites = this._sites.asReadonly();
    readonly operators = this._operators.asReadonly();
    readonly products = this._products.asReadonly();
    readonly beneficiaries = this._beneficiaries.asReadonly();
    readonly deliveries = this._deliveries.asReadonly();
    readonly alerts = this._alerts.asReadonly();
    readonly approvals = this._approvals.asReadonly();
    readonly shipments = this._shipments.asReadonly();
    readonly duplicateWindowDays = this._duplicateWindowDays.asReadonly();
    readonly cart = this._cart.asReadonly();
    readonly lastDelivery = this._lastDelivery.asReadonly();
    readonly serviceDown = this._serviceDown.asReadonly();

    readonly cartItemCount = computed(() => this._cart().reduce((sum, item) => sum + item.quantity, 0));

    readonly cartTotal = computed(() => {
        const prods = this._products();
        return this._cart().reduce((total, item) => {
            const product = prods.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    });

    readonly currentOperator = computed<SafeOperator | null>(() => {
        const op = this._operators().find(o => o.id === this._currentOperatorId());
        return op ? this.toSafe(op) : null;
    });

    readonly isLoggedIn = computed(() => this.currentOperator() !== null);

    readonly currentSite = computed<Site | null>(() => {
        const op = this.currentOperator();
        return op ? this._sites().find(s => s.id === op.siteId) ?? null : null;
    });

    // Salvataggio automatico nel localStorage tramite effect
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

    // --- HELPER DI UTILITÀ GENERALE ---
    private newId(): string {
        return crypto.randomUUID();
    }

    private nowIso(): string {
        return new Date().toISOString();
    }

    todayIso(): string {
        return this.nowIso().slice(0, 10);
    }

    daysBetween(fromIso: string, toIso: string): number {
        const from = new Date(fromIso.slice(0, 10)).getTime();
        const to = new Date(toIso.slice(0, 10)).getTime();
        return Math.round((to - from) / MS_PER_DAY);
    }

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

    private toSafe(op: Operator): SafeOperator {
        const { password, ...safe } = op;
        return safe;
    }

    // --- LOCALSTORAGE & API SIMULATION ---
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
            // Fallback in memoria in caso di restrizioni dello storage
        }
    }

    private async fakeApi<T>(work: () => T, delayMs: number = FAKE_API_DELAY_MS): Promise<T> {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        if (this._serviceDown()) {
            throw new Error('Servizio non disponibile. Riprova più tardi.');
        }
        return work();
    }

    // --- GESTIONE RUOLI E PERMESSI ---
    private requireLogin(): Operator {
        const op = this._operators().find(o => o.id === this._currentOperatorId());
        if (!op) throw new Error('Sessione scaduta: effettua di nuovo il login');
        return op;
    }

    private requireRole(allowedRoles: Role[]): Operator {
        const op = this.requireLogin();
        if (!allowedRoles.includes(op.role)) {
            throw new Error('Autorizzazione insufficiente per questa operazione');
        }
        return op;
    }

    // --- METODI DI AUTENTICAZIONE E SESSIONE ---
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

    // --- GESTIONE CARRELLO E MAGAZZINO (Ruoli: Operator, User, Admin, S-Admin) ---
    addToCart(productId: string, quantity: number = 1): void {
        this._cart.update(items => {
            const index = items.findIndex(i => i.productId === productId);
            if (index > -1) {
                const updated = [...items];
                updated[index] = { ...updated[index], quantity: updated[index].quantity + quantity };
                return updated;
            }
            return [...items, { productId, quantity }];
        });
    }

    removeFromCart(productId: string): void {
        this._cart.update(items => items.filter(i => i.productId !== productId));
    }

    updateCartQuantity(productId: string, quantity: number): void {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        this._cart.update(items => {
            const index = items.findIndex(i => i.productId === productId);
            if (index > -1) {
                const updated = [...items];
                updated[index] = { ...updated[index], quantity };
                return updated;
            }
            return [...items, { productId, quantity }];
        });
    }

    clearCart(): CartItem[] {
        this._cart.set([]);
        return [];
    }

    // Aggiunge merce all'inventario esistente e aggiorna il catalogo globale
    addStockToInventory(productId: string, quantity: number, expiryDate: string): void {
        const currentUser = this.currentOperator();
        if (!currentUser) return;

        const product = this.getProduct(productId);
        if (!product) return;

        // 1. Aggiorna l'inventario specifico della sede
        this._inventories.update(invs => {
            const existingIndex = invs.findIndex(i =>
                i.productId === productId &&
                i.siteId === currentUser.siteId &&
                i.expiry === expiryDate
            );

            if (existingIndex > -1) {
                const updated = [...invs];
                updated[existingIndex] = { ...updated[existingIndex], stock: updated[existingIndex].stock + quantity };
                return updated;
            } else {
                return [...invs, {
                    siteId: currentUser.siteId, productId: productId, productName: product.name,
                    weight: product.unit, stock: quantity, expiry: expiryDate,
                    isExpiringSoon: false, isExpired: false
                }];
            }
        });

        // 2. Aggiorna il totale globale nel catalogo (così la pagina Inventario si aggiorna!)
        this._products.update(prods => {
            const pIndex = prods.findIndex(p => p.id === productId);
            if (pIndex > -1) {
                const updatedP = [...prods];
                updatedP[pIndex] = { ...updatedP[pIndex], stock: updatedP[pIndex].stock + quantity };
                return updatedP;
            }
            return prods;
        });
    }

    // --- METODI DI GESTIONE SPECIFICI PER I 4 RUOLI ---

    /** 1. Ente Distribuente - User: Registrazione consegne ai beneficiari */
    async registerDelivery(draft: DeliveryDraft): Promise<RegisterDeliveryResult> {
        return this.fakeApi(() => {
            const op = this.requireRole(['User', 'Admin', 'Operator', 'S-Admin']);

            const beneficiary = this._beneficiaries().find(b => b.id === draft.beneficiaryId);
            if (!beneficiary) throw new Error('Beneficiario non trovato');

            let tokensNeeded = 0;
            const deliveryItems: DeliveryItem[] = draft.items.map(item => {
                const prod = this._products().find(p => p.id === item.productId);
                if (!prod) throw new Error(`Prodotto con ID ${item.productId} non trovato`);
                tokensNeeded += prod.price * item.quantity;
                return {
                    productId: prod.id,
                    name: prod.name,
                    quantity: item.quantity,
                    price: prod.price
                };
            });

            const newDelivery: Delivery = {
                id: this.newId(),
                beneficiaryId: draft.beneficiaryId,
                operatorId: op.id,
                siteId: draft.siteId,
                date: new Date().toISOString(),
                items: deliveryItems,
                tokensUsed: tokensNeeded,
                status: 'Completata'
            };

            this._deliveries.update(list => [newDelivery, ...list]);
            this._lastDelivery.set(newDelivery);
            this._cart.set([]);

            return { delivery: newDelivery, alert: null };
        });
    }

    /** 2. Ente Distribuente - Admin: Gestione richieste di approvazione e riordino locale */
    async requestApproval(type: ApprovalType, description: string, details?: { beneficiaryId?: string; extraTokens?: number; productId?: string; quantity?: number }): Promise<ApprovalRequest> {
        return this.fakeApi(() => {
            const op = this.requireRole(['User', 'Admin']);
            const newRequest: ApprovalRequest = {
                id: this.newId(),
                type,
                description,
                requestedBy: op.id,
                date: this.nowIso(),
                status: 'In attesa',
                ...details
            };
            this._approvals.update(list => [newRequest, ...list]);
            return newRequest;
        });
    }

    /** 3. Metro - Operator: Gestione spedizioni verso i magazzini satellite */
    async createShipment(toSiteId: string, items: CartItem[]): Promise<Shipment> {
        return this.fakeApi(() => {
            const op = this.requireRole(['Operator', 'S-Admin']);
            const newShipment: Shipment = {
                id: this.newId(),
                trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
                fromSiteId: op.siteId,
                toSiteId,
                items,
                status: 'Ordinato',
                createdAt: this.nowIso()
            };
            this._shipments.update(list => [newShipment, ...list]);
            return newShipment;
        });
    }

    /** 4. Metro - S-Admin: Approvazione richieste globali e configurazione di sistema */
    async decideApproval(approvalId: string, status: ApprovalStatus): Promise<ApprovalRequest> {
        return this.fakeApi(() => {
            const op = this.requireRole(['S-Admin']);
            let updatedReq: ApprovalRequest | null = null;

            this._approvals.update(list => list.map(req => {
                if (req.id === approvalId) {
                    updatedReq = {
                        ...req,
                        status,
                        decidedBy: op.id,
                        decidedAt: this.nowIso()
                    };
                    return updatedReq;
                }
                return req;
            }));

            if (!updatedReq) throw new Error('Richiesta di approvazione non trovata');
            return updatedReq;
        });
    }

    // --- STRUMENTI DI RESET E CONTROLLO DEMO ---
    setServiceDown(down: boolean): void {
        this._serviceDown.set(down);
    }

    resetDemoData(): void {
        const keys = ['products', 'beneficiaries', 'deliveries', 'alerts', 'approvals', 'shipments', 'duplicateWindow', 'operatorId'];
        keys.forEach(key => {
            try { localStorage.removeItem(STORAGE_PREFIX + key); } catch { }
        });
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
    //AVAILABILITY EACH STORE

    private readonly _inventories = signal<SiteInventory[]>(this.load('inventories', SEED_INVENTORIES));
    readonly inventories = this._inventories.asReadonly();


    searchInventoryProducts(query: string): { productId: string; productName: string }[] {
        const q = query.toLowerCase().trim();
        if (!q) return [];

        const inventories = this._inventories();
        const uniqueMap = new Map<string, string>();

        for (const inv of inventories) {
            if (inv.productName.toLowerCase().includes(q)) {
                uniqueMap.set(inv.productId, inv.productName);
            }
        }

        return Array.from(uniqueMap.entries()).map(([productId, productName]) => ({
            productId,
            productName
        }));
    }

    /** Restituisce la disponibilità di un prodotto specifico in tutte le sedi */
    getInventoriesForProduct(productId: string): StoreAvailabilityResult[] {
        const sites = this._sites();
        const inventories = this._inventories();

        // Distanze simulate fisse per demo tra le sedi
        const distances: Record<string, string> = {
            '96996a93-e59e-4fc6-91f3-99972fd6d977': '4,2 km',
            '4e81f18f-a6af-45a9-adbe-d82dd95d6b44': '0,0 km',
            's-parabiago': '5,1 km',
            '502231c0-021d-42c1-9f3c-0ab1f15fca8f': '6,5 km'
        };

        return sites.map(site => {
            // Cerca l'inventario per questa sede e questo prodotto
            const inv = inventories.find(i => i.siteId === site.id && i.productId === productId);
            return {
                siteId: site.id,
                siteName: site.name,
                stock: inv ? inv.stock : 0,
                distance: distances[site.id] ?? '5,0 km'
            };
        });
    }

    // BENEFICIARI
}