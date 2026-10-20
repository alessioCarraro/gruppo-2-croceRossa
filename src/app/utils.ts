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
export type ApprovalType = 'Nuovo beneficiario' | 'Token extra' | 'Riordino' | 'Nuovo prodotto' | 'Rifornimento sede';
// 'Nel carrello' = richiesta di riordino aggiunta al carrello di rifornitura; 'Inviata' = ordine inviato
export type ApprovalStatus = 'In attesa' | 'Approvata' | 'Rifiutata' | 'Nel carrello' | 'Inviata';
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
    lot: string;
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

/** Riga di giacenza della metro: unico formato usato da inventario, scadenze e dashboard (Super Admin e Operator) */
export interface MetroStockItem {
    productId: string;
    name: string;
    category: string;
    icon: 'bag' | 'bottle' | 'meat';
    iconType: 'bag' | 'meat' | 'jar';
    price: number;
    stock: number;
    expiry: string; // 'YYYY-MM-DD'
    isExpiringSoon: boolean;
}

/** Statistiche di una sede (o di tutte le sedi): stessi criteri per Super Admin e Operator */
export interface SiteStats {
    stockValue: number;     // valore delle giacenze (quantità × prezzo in token)
    expiredValue: number;   // valore dei prodotti scaduti
    totalItems: number;     // somma delle quantità in magazzino
    outgoingItems: number;  // pezzi in uscita (spedizioni non ancora arrivate)
    expiringItems: number;  // quantità di articoli in scadenza (somma delle giacenze)
    requestCount: number;   // richieste di riordino ancora da gestire
}

/** Articolo in scadenza di una sede (usato dalla pagina "Prossimi a scadenza") */
export interface ExpiringStockItem {
    productId: string;
    name: string;
    siteName: string;
    stock: number;
    expiry: string; // 'YYYY-MM-DD'
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
    siteId?: string; // Foreign key (UUID): sede che ha inviato la richiesta (per 'Rifornimento sede': sede destinataria)
    items?: CartItem[]; // prodotti e quantità (usato da 'Rifornimento sede')
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

/** Prodotto contenuto in un collo */
export interface TrackingItem {
    name: string;
    lot: string;
    expiry: string; // 'YYYY-MM-DD'
    quantity: number;
}

export interface TrackingNumber {
    id: string;
    code: string;
    category: string;
    quantity: number;
    fromSiteId: string;
    toSiteId: string;
    status: 'Arrivato' | 'In transito' | 'Ricevuto'; // 'Ricevuto' = ricezione confermata (storico)
    receivedAt?: string;
    items: TrackingItem[]; // prodotti contenuti nel collo
}

// COSTANTI E DATI INIZIALI (il "finto database")

export const TOKENS_PER_ADULTI = 250;
export const TOKENS_PER_MINORI = 75;
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
        id: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', name: 'Sede Legnano', type: 'EnteDistributore', address: 'Via Gilardelli', city: 'Legnano',
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
        lot: 'C-9012', iconType: 'bag'
    },
    {
        id: 'edff434d-ceab-490a-9bba-b47366139ce2', name: 'Pasta integrale 500g', category: 'Pasta', unit: 'Pacco', icon: 'bag', stock: 58,
        minStock: 60, isOutOfStock: false, price: 22, expiry: '2026-10-25', isExpiringSoon: true, isExpired: false, maxPerBeneficiary: 3,
        lot: 'C-9013', iconType: 'bag'
    },
    {
        id: '4396be27-f626-4032-8db2-18cbbb56d26a', name: 'Passata di pomodoro 700g', category: 'Verdura', unit: 'Scatola', icon: 'bottle', stock: 300,
        minStock: 40, isOutOfStock: false, price: 15, expiry: '2026-10-28', isExpiringSoon: true, isExpired: false, maxPerBeneficiary: 4,
        lot: 'C-9011', iconType: 'bag'
    },
    {
        id: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', name: 'Petto di pollo 1kg', category: 'Carne', unit: 'Kg', icon: 'meat', stock: 25,
        minStock: 30, isOutOfStock: false, price: 40, expiry: '2026-11-02', isExpiringSoon: true, isExpired: false, maxPerBeneficiary: 2,
        lot: 'C-9016', iconType: 'meat'
    },
    {
        id: '61321c12-9f01-4493-95f6-e7406296257b', name: 'Omogeneizzato carne', category: 'Omogeneizzati', unit: 'Scatola', icon: 'bottle', stock: 0,
        minStock: 20, isOutOfStock: true, price: 12, expiry: '2026-10-12', isExpiringSoon: false, isExpired: true, maxPerBeneficiary: 6,
        lot: 'C-9014', iconType: 'jar'
    },
];

export const SEED_INVENTORIES: SiteInventory[] = [
    // Sede Legnano
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', productName: 'Pasta penne', weight: '500g', stock: 120, expiry: '2027-05-15', isExpiringSoon: false, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: 'edff434d-ceab-490a-9bba-b47366139ce2', productName: 'Pasta spaghetti', weight: '500g', stock: 18, expiry: '2026-10-26', isExpiringSoon: true, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: '4396be27-f626-4032-8db2-18cbbb56d26a', productName: 'Petto di pollo', weight: '450g', stock: 1, expiry: '2026-10-30', isExpiringSoon: true, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', productName: 'Biscotti Galleltti', weight: '1Kg', stock: 4, expiry: '2026-11-01', isExpiringSoon: true, isExpired: false },
    { siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', productId: '61321c12-9f01-4493-95f6-e7406296257b', productName: 'Risco Basmati', weight: '500g', stock: 2, expiry: '2026-10-14', isExpiringSoon: false, isExpired: true },

    // Sede Busto Arsizio
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', productName: 'Pasta penne', weight: '500g', stock: 100, expiry: '2027-05-15', isExpiringSoon: false, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: 'edff434d-ceab-490a-9bba-b47366139ce2', productName: 'Pasta spaghetti', weight: '500g', stock: 20, expiry: '2026-10-27', isExpiringSoon: true, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: '4396be27-f626-4032-8db2-18cbbb56d26a', productName: 'Petto di pollo', weight: '450g', stock: 1, expiry: '2026-10-29', isExpiringSoon: true, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', productName: 'Biscotti Galleltti', weight: '1Kg', stock: 25, expiry: '2026-11-02', isExpiringSoon: true, isExpired: false },
    { siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f', productId: '61321c12-9f01-4493-95f6-e7406296257b', productName: 'Risco Basmati', weight: '500g', stock: 2, expiry: '2026-10-15', isExpiringSoon: false, isExpired: true },

    // Metro
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', productName: 'Pasta penne', weight: '500g', stock: 420, expiry: '2027-05-15', isExpiringSoon: false, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: 'edff434d-ceab-490a-9bba-b47366139ce2', productName: 'Pasta spaghetti', weight: '500g', stock: 58, expiry: '2026-10-25', isExpiringSoon: true, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: '4396be27-f626-4032-8db2-18cbbb56d26a', productName: 'Petto di pollo', weight: '450g', stock: 5, expiry: '2026-10-28', isExpiringSoon: true, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', productName: 'Biscotti Galleltti', weight: '1Kg', stock: 25, expiry: '2026-11-02', isExpiringSoon: true, isExpired: false },
    { siteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', productId: '61321c12-9f01-4493-95f6-e7406296257b', productName: 'Risco Basmati', weight: '500g', stock: 2, expiry: '2026-10-12', isExpiringSoon: false, isExpired: true },
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

// Esempi di approvazioni:
// - 2 richieste di token extra (le gestisce l'Admin di sede, non il Super Admin);
// - 2 ordini di rifornimento da approvare per il Super Admin: 1 con un solo prodotto, 1 con 3 articoli;
// - richieste di riordino delle sedi (Legnano, Parabiago, Busto Arsizio): compaiono nella Rifornitura
export const SEED_APPROVALS: ApprovalRequest[] = [
    // 1. Richiesta di token extra
    {
        id: '7fc5855a-0f28-460d-92df-9f19498bc74f',
        type: 'Token extra',
        description: '+50% token extra per Mario Rossi',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-15T08:30:00.000Z',
        status: 'In attesa',
        beneficiaryId: '4c3e3adf-b60e-4187-b1f5-4ad73b13dd06',
        extraTokens: 225
    },
    // 1b. Seconda richiesta di token (per provare sia "Accetta" sia "Rifiuta" nella pagina Richieste dell'Admin)
    {
        id: '9d2c1a64-3f0b-4b8e-a1c7-6e5d4f3b2a10',
        type: 'Token extra',
        description: '+50% token extra per Pietro Moretti',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-16T10:15:00.000Z',
        status: 'In attesa',
        beneficiaryId: '343f5707-a16f-4995-9e40-790e80226260',
        extraTokens: 125
    },
    // 2. Richiesta di prodotto singola (un solo prodotto)
    {
        id: '50890db5-6695-4b49-800c-ca17486ca1c8',
        type: 'Riordino',
        description: 'Riordino 100 Omogeneizzato carne',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-15T09:00:00.000Z',
        status: 'In attesa',
        siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44',
        productId: '61321c12-9f01-4493-95f6-e7406296257b',
        quantity: 100
    },
    // 3. Richiesta con 3 articoli (ordine di rifornimento verso Parabiago)
    {
        id: '3b1f6c1e-7a52-4e0b-9c63-5d2f8a4e1b77',
        type: 'Rifornimento sede',
        description: 'Rifornimento a Parabiago: 3 prodotti',
        requestedBy: 'd34dfbfe-45a9-4b67-8d03-c99d7fa4a4b5',
        date: '2026-10-16T09:00:00.000Z',
        status: 'In attesa',
        siteId: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f',
        items: [
            { productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0', quantity: 120 },
            { productId: 'edff434d-ceab-490a-9bba-b47366139ce2', quantity: 30 },
            { productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', quantity: 10 }
        ]
    },
    // Ordine di rifornimento con un solo prodotto (richiesta singola per il Super Admin)
    {
        id: '5e8a0c3d-2b1f-4d6a-9c47-1f3e5a7b9d20',
        type: 'Rifornimento sede',
        description: 'Rifornimento a Busto Arsizio: 1 prodotto',
        requestedBy: 'd34dfbfe-45a9-4b67-8d03-c99d7fa4a4b5',
        date: '2026-10-16T08:30:00.000Z',
        status: 'In attesa',
        siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f',
        items: [
            { productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229', quantity: 10 }
        ]
    },
    {
        id: 'seed-riordino-legnano-1',
        type: 'Riordino',
        description: 'Riordino 80 Pasta di semola 500g',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-16T08:00:00.000Z',
        status: 'In attesa',
        siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44',
        productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0',
        quantity: 80
    },
    {
        id: 'seed-riordino-legnano-2',
        type: 'Riordino',
        description: 'Riordino 10 Petto di pollo 1kg',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-16T09:00:00.000Z',
        status: 'In attesa',
        siteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44',
        productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229',
        quantity: 10
    },
    {
        id: 'seed-riordino-parabiago-1',
        type: 'Riordino',
        description: 'Riordino 40 Pasta integrale 500g',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-17T08:00:00.000Z',
        status: 'In attesa',
        siteId: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f',
        productId: 'edff434d-ceab-490a-9bba-b47366139ce2',
        quantity: 40
    },
    {
        id: 'seed-riordino-parabiago-2',
        type: 'Riordino',
        description: 'Riordino 50 Passata di pomodoro 700g',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-17T09:00:00.000Z',
        status: 'In attesa',
        siteId: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f',
        productId: '4396be27-f626-4032-8db2-18cbbb56d26a',
        quantity: 50
    },
    {
        id: 'seed-riordino-parabiago-3',
        type: 'Riordino',
        description: 'Riordino 30 Omogeneizzato carne',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-17T10:00:00.000Z',
        status: 'In attesa',
        siteId: 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f',
        productId: '61321c12-9f01-4493-95f6-e7406296257b',
        quantity: 30
    },
    {
        id: 'seed-riordino-busto-1',
        type: 'Riordino',
        description: 'Riordino 70 Pasta di semola 500g',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-18T08:00:00.000Z',
        status: 'In attesa',
        siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f',
        productId: '4b45aa99-76d8-4eb9-acbc-87e300c197f0',
        quantity: 70
    },
    {
        id: 'seed-riordino-busto-2',
        type: 'Riordino',
        description: 'Riordino 45 Passata di pomodoro 700g',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-18T09:00:00.000Z',
        status: 'In attesa',
        siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f',
        productId: '4396be27-f626-4032-8db2-18cbbb56d26a',
        quantity: 45
    },
    {
        id: 'seed-riordino-busto-3',
        type: 'Riordino',
        description: 'Riordino 15 Petto di pollo 1kg',
        requestedBy: 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2',
        date: '2026-10-18T10:00:00.000Z',
        status: 'In attesa',
        siteId: '502231c0-021d-42c1-9f3c-0ab1f15fca8f',
        productId: 'e8f3375e-63d7-4171-8c1b-d92af7cd5229',
        quantity: 15
    }
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

export const SEED_TRACKING_NUMBER: TrackingNumber[] = [
    {
        id: '449cbebf-a778-4812-bc88-0fead3190ef7', category: 'Alimenti', quantity: 24, code: 'TRK-77812',
        fromSiteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', toSiteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', status: 'Arrivato',
        items: [
            { name: 'Pasta di semola 500g', lot: 'C-9012', expiry: '2027-05-15', quantity: 10 },
            { name: 'Pasta integrale 500g', lot: 'C-9013', expiry: '2026-10-25', quantity: 8 },
            { name: 'Passata di pomodoro 700g', lot: 'C-9011', expiry: '2026-10-28', quantity: 6 }
        ]
    },
    {
        id: '016a38bf-1098-43b3-888e-315113863e0f', category: 'Igiene', quantity: 12, code: 'TRK-77805',
        fromSiteId: '96996a93-e59e-4fc6-91f3-99972fd6d977', toSiteId: '4e81f18f-a6af-45a9-adbe-d82dd95d6b44', status: 'In transito',
        items: [
            { name: 'Sapone liquido 500ml', lot: 'C-8120', expiry: '2028-03-01', quantity: 6 },
            { name: 'Dentifricio 75ml', lot: 'C-8121', expiry: '2028-06-30', quantity: 6 }
        ]
    }
];

// ==========================================
// 3. CLASSE DEL SERVICE (MockBackendService)
// ==========================================

@Injectable({ providedIn: 'root' })
export class MockBackendService {
    // Stato privato basato su Signals e localStorage
    private readonly _sites = signal<Site[]>(SEED_SITES);
    private readonly _operators = signal<Operator[]>(SEED_OPERATORS);
    private readonly _products = signal<Product[]>(this.load('products_v2', SEED_PRODUCTS));
    private readonly _beneficiaries = signal<Beneficiary[]>(this.load('beneficiaries', SEED_BENEFICIARIES));
    private readonly _deliveries = signal<Delivery[]>(this.load('deliveries', SEED_DELIVERIES));
    private readonly _alerts = signal<DeliveryAlert[]>(this.load('alerts', SEED_ALERTS));
    private readonly _approvals = signal<ApprovalRequest[]>(this.load('approvals_v3', SEED_APPROVALS));
    private readonly _shipments = signal<Shipment[]>(this.load('shipments', SEED_SHIPMENTS));
    private readonly _trackingNumber = signal<TrackingNumber[]>(this.load('trackingNumber_v2', SEED_TRACKING_NUMBER));
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
    /**
     * Approvazioni in attesa che spettano al Super Admin: ordini di rifornimento e nuovi prodotti.
     * Le richieste di token extra le gestisce l'Admin di sede; i riordini delle sedi passano dalla Rifornitura.
     */
    readonly superAdminApprovals = computed(() =>
        this._approvals().filter(a => a.status === 'In attesa' && (a.type === 'Rifornimento sede' || a.type === 'Nuovo prodotto'))
    );
    // Numero di approvazioni in attesa: stessa regola della lista "Approvazioni" (badge della barra in basso)
    readonly pendingApprovalCount = computed(() => this.superAdminApprovals().length);
    readonly shipments = this._shipments.asReadonly();
    readonly trackingNumber = this._trackingNumber.asReadonly();
    // Colli ancora da ricevere (quelli con ricezione confermata restano nello storico)
    readonly pendingTrackingNumbers = computed(() => this._trackingNumber().filter(t => t.status !== 'Ricevuto'));
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
        effect(() => this.save('products_v2', this._products()));
        effect(() => this.save('beneficiaries', this._beneficiaries()));
        effect(() => this.save('deliveries', this._deliveries()));
        effect(() => this.save('alerts', this._alerts()));
        effect(() => this.save('approvals_v3', this._approvals()));
        effect(() => this.save('shipments', this._shipments()));
        // Salva i colli: la ricezione confermata resta anche ricaricando
        effect(() => this.save('trackingNumber_v2', this._trackingNumber()));
        effect(() => this.save('duplicateWindow', this._duplicateWindowDays()));
        effect(() => this.save('operatorId', this._currentOperatorId()));
        // Salva anche l'inventario delle sedi, così i carichi non si perdono al ricaricamento
        effect(() => this.save('inventories_v2', this._inventories()));
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

    /**
     * Aggiunge una quantità alla giacenza di un prodotto GIÀ presente nella metro.
     * Aggiorna sia l'inventario della metro sia la giacenza nel catalogo.
     * Lancia un errore se la quantità non è valida o il prodotto non è in metro.
     */
    async addStockToMetro(productId: string, quantity: number): Promise<void> {
        return this.fakeApi(() => {
            this.requireLogin();

            // La quantità deve essere un numero intero maggiore di zero
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('Quantità non valida');
            }

            const metro = this._sites().find(s => s.type === 'Metro');
            const index = this._inventories().findIndex(i => i.siteId === metro?.id && i.productId === productId);
            if (index === -1) {
                throw new Error('Prodotto non presente nella metro');
            }

            // 1. Somma la quantità alla giacenza esistente nella metro
            this._inventories.update(invs => {
                const updated = [...invs];
                updated[index] = { ...updated[index], stock: updated[index].stock + quantity };
                return updated;
            });

            // 2. Tiene allineata la giacenza del catalogo
            this._products.update(prods => prods.map(p =>
                p.id === productId ? { ...p, stock: p.stock + quantity } : p
            ));
        });
    }

    /**
     * Mette in coda, "In attesa" di conferma del superadmin, un nuovo prodotto
     * non ancora registrato. La richiesta compare nella lista `approvals`.
     */
    async requestNewProductApproval(description: string): Promise<ApprovalRequest> {
        return this.fakeApi(() => {
            const op = this.requireLogin();
            const newRequest: ApprovalRequest = {
                id: this.newId(),
                type: 'Nuovo prodotto',
                description,
                requestedBy: op.id,
                date: this.nowIso(),
                status: 'In attesa'
            };
            this._approvals.update(list => [newRequest, ...list]);
            return newRequest;
        });
    }

    // Aggiunge un prodotto completamente nuovo al catalogo e ne registra il primo carico
    registerNewProductAndStock(
        name: string,
        category: string,
        price: number,
        quantity: number,
        expiryDate: string
    ): void {
        const currentUser = this.currentOperator();
        if (!currentUser) return;

        const newProductId = this.newId();
        const newProduct: Product = {
            id: newProductId,
            name: name,
            category: category as any, // Cast per simulare l'inserimento libero
            unit: 'Pacco',             // Default per i nuovi inserimenti
            icon: 'bag',
            stock: 0,
            minStock: 10,
            isOutOfStock: false,
            price: price,
            expiry: expiryDate,
            isExpiringSoon: false,
            isExpired: false,
            maxPerBeneficiary: 5,
            lot: 'C-9015',
            iconType: 'bag'
        };

        // 1. Aggiunge il nuovo prodotto all'inizio del catalogo globale
        this._products.update(prods => [newProduct, ...prods]);

        // 2. Sfrutta la funzione già esistente per caricare i pezzi nel magazzino della sede
        this.addStockToInventory(newProductId, quantity, expiryDate);
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

            if (deliveryItems.length === 0) throw new Error('Nessun prodotto selezionato');

            // Controlli prima di modificare qualsiasi dato: se falliscono non cambia nulla
            if (beneficiary.tokens < tokensNeeded) throw new Error('Token insufficienti');
            for (const item of draft.items) {
                if (!Number.isInteger(item.quantity) || item.quantity <= 0) throw new Error('Quantità non valida');
                const available = this._inventories()
                    .filter(inv => inv.siteId === draft.siteId && inv.productId === item.productId)
                    .reduce((sum, inv) => sum + inv.stock, 0);
                if (available < item.quantity) throw new Error('Giacenza insufficiente');
            }

            // 1. Scala la giacenza della sede (prima i lotti con scadenza più vicina)
            const updatedInventories = this._inventories().map(inv => ({ ...inv }));
            for (const item of draft.items) {
                let remaining = item.quantity;
                updatedInventories
                    .filter(inv => inv.siteId === draft.siteId && inv.productId === item.productId)
                    .sort((a, b) => a.expiry.localeCompare(b.expiry))
                    .forEach(lot => {
                        const take = Math.min(lot.stock, remaining);
                        lot.stock -= take;
                        remaining -= take;
                    });
            }
            this._inventories.set(updatedInventories);
            this._products.update(prods => prods.map(p => {
                const item = draft.items.find(i => i.productId === p.id);
                return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p;
            }));

            // 2. Addebita i token al beneficiario
            this._beneficiaries.update(list => list.map(b =>
                b.id === beneficiary.id
                    ? { ...b, tokens: b.tokens - tokensNeeded, hasTokens: b.tokens - tokensNeeded > 0 }
                    : b
            ));

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
                siteId: op.siteId, // sede che invia la richiesta
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
    async decideApproval(approvalId: string, status: ApprovalStatus, items?: CartItem[]): Promise<ApprovalRequest> {
        return this.fakeApi(() => {
            const op = this.requireRole(['S-Admin', 'Admin']);
            const target = this._approvals().find(a => a.id === approvalId);

            if (!target) throw new Error('Richiesta di approvazione non trovata');
            // I token extra li decide solo l'Admin di sede; le altre richieste solo il Super Admin
            const isTokenRequest = target.type === 'Token extra';
            if ((op.role === 'Admin') !== isTokenRequest) {
                throw new Error('Autorizzazione insufficiente per questa operazione');
            }
            // Evita di applicare due volte la stessa decisione (es. doppio click)
            if (target.status !== 'In attesa') throw new Error('Richiesta già gestita');

            const updatedReq: ApprovalRequest = {
                ...target,
                status,
                ...(items ? { items } : {}), // articoli rimasti dopo eventuali rimozioni
                decidedBy: op.id,
                decidedAt: this.nowIso()
            };
            this._approvals.update(list => list.map(req => req.id === approvalId ? updatedReq : req));

            // Token extra approvati: i token vengono accreditati al beneficiario
            if (status === 'Approvata' && target.type === 'Token extra' && target.beneficiaryId) {
                this._beneficiaries.update(list => list.map(b =>
                    b.id === target.beneficiaryId
                        ? { ...b, tokens: b.tokens + (target.extraTokens ?? 0), hasTokens: true }
                        : b
                ));
            }

            return updatedReq;
        });
    }

    /**
     * Invio DIRETTO di un ordine di rifornimento (solo S-Admin, senza richiesta di conferma).
     * Crea la spedizione dalla metro verso la sede, scala la giacenza della metro e
     * segna come 'Inviata' le richieste di riordino confluite nell'ordine.
     * Lancia un errore se la sede non esiste, il carrello è vuoto o la giacenza non basta.
     */
    async sendRestockShipment(toSiteId: string, items: CartItem[], sourceRequestIds: string[] = []): Promise<Shipment> {
        return this.fakeApi(() => {
            this.requireRole(['S-Admin']);

            if (!this._sites().some(s => s.id === toSiteId)) throw new Error('Sede non trovata');
            if (items.length === 0) throw new Error('Il carrello è vuoto');

            const metro = this._sites().find(s => s.type === 'Metro');
            if (!metro) throw new Error('Metro non trovata');

            // Controllo preventivo: la metro deve avere abbastanza giacenza per ogni prodotto
            const invs = this._inventories();
            for (const item of items) {
                const inv = invs.find(i => i.siteId === metro.id && i.productId === item.productId);
                if (!inv || inv.stock < item.quantity) {
                    throw new Error('Giacenza insufficiente in metro');
                }
            }

            // 1. Scala la giacenza della metro (inventario e catalogo)
            this._inventories.update(list => list.map(inv => {
                const item = items.find(i => inv.siteId === metro.id && i.productId === inv.productId);
                return item ? { ...inv, stock: inv.stock - item.quantity } : inv;
            }));
            this._products.update(prods => prods.map(p => {
                const item = items.find(i => i.productId === p.id);
                return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p;
            }));

            // 2. Crea la spedizione
            const shipment: Shipment = {
                id: this.newId(),
                trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
                fromSiteId: metro.id,
                toSiteId,
                items,
                status: 'Ordinato',
                createdAt: this.nowIso()
            };
            this._shipments.update(list => [shipment, ...list]);

            // 3. Le richieste di riordino spedite non compaiono più nell'elenco della sede
            this._approvals.update(list =>
                list.map(a => sourceRequestIds.includes(a.id) ? { ...a, status: 'Inviata' as const } : a)
            );

            return shipment;
        });
    }

    /**
     * Invia a conferma del superadmin un ordine di rifornimento verso una sede.
     * La richiesta resta "In attesa" e contiene prodotti e quantità del carrello.
     * Lancia un errore se la sede non esiste o il carrello è vuoto.
     */
    async requestRestockApproval(toSiteId: string, items: CartItem[], sourceRequestIds: string[] = []): Promise<ApprovalRequest> {
        return this.fakeApi(() => {
            const op = this.requireLogin();

            if (!this._sites().some(s => s.id === toSiteId)) throw new Error('Sede non trovata');
            if (items.length === 0) throw new Error('Il carrello è vuoto');

            const newRequest: ApprovalRequest = {
                id: this.newId(),
                type: 'Rifornimento sede',
                description: `Rifornimento a ${this.getSiteName(toSiteId)}: ${items.length} prodotti`,
                requestedBy: op.id,
                date: this.nowIso(),
                status: 'In attesa',
                siteId: toSiteId,
                items
            };
            // Le richieste di riordino confluite in questo ordine passano a 'Inviata':
            // non compaiono più nell'elenco delle richieste della sede
            this._approvals.update(list => [
                newRequest,
                ...list.map(a => sourceRequestIds.includes(a.id) ? { ...a, status: 'Inviata' as const } : a)
            ]);
            return newRequest;
        });
    }

    /**
     * Cambia lo stato di alcune richieste di riordino.
     * Usato dal carrello: 'Nel carrello' quando vengono aggiunte, 'In attesa' se tolte dal carrello.
     * Lo stato è salvato nel localStorage, quindi resta anche cambiando pagina o ricaricando.
     */
    setRestockRequestsStatus(requestIds: string[], status: ApprovalStatus): void {
        if (requestIds.length === 0) return;
        this._approvals.update(list =>
            list.map(a => requestIds.includes(a.id) ? { ...a, status } : a)
        );
    }

    /**
     * Statistiche di una sede, oppure di tutte le sedi (siteId = null).
     * È l'UNICA funzione usata dalle dashboard di Super Admin e Operator: stessi dati, stessi criteri.
     * Legge solo i dati condivisi (non li modifica), quindi si aggiorna da sola in un computed.
     *
     * Criteri:
     * - ogni record di inventario (sede + prodotto) è contato una sola volta;
     * - valore = giacenza × prezzo del prodotto; "scaduto" e "in scadenza" seguono i flag dell'inventario;
     * - "in scadenza" = somma delle quantità in scadenza (lo stesso totale della pagina Prossimi a scadenza);
     * - in uscita = pezzi delle spedizioni partite dalla sede e non ancora 'Arrivato';
     * - richieste = numero di richieste di riordino 'In attesa' (non il numero di articoli).
     */
    siteStats(siteId: string | null): SiteStats {
        const products = this._products();
        const inventories = this._inventories().filter(inv => !siteId || inv.siteId === siteId);

        let stockValue = 0;
        let expiredValue = 0;
        let totalItems = 0;
        let expiringItems = 0;

        for (const inv of inventories) {
            const price = products.find(p => p.id === inv.productId)?.price ?? 0;
            stockValue += inv.stock * price;
            totalItems += inv.stock;
            if (inv.isExpiringSoon) expiringItems += inv.stock;
            if (inv.isExpired) expiredValue += inv.stock * price;
        }

        const outgoingItems = this._shipments()
            .filter(sh => sh.status !== 'Arrivato' && (!siteId || sh.fromSiteId === siteId))
            .reduce((sum, sh) => sum + sh.items.reduce((q, i) => q + i.quantity, 0), 0);

        const requestCount = siteId ? this.restockRequestCount(siteId) : this.totalRestockRequestCount();

        return { stockValue, expiredValue, totalItems, outgoingItems, expiringItems, requestCount };
    }

    /**
     * Registra la ricezione di un collo: passa a 'Ricevuto' e sparisce dall'elenco dei colli da ricevere.
     * Il collo resta nei dati (storico). Lancia un errore se non esiste o è già stato ricevuto.
     */
    async confirmTrackingReceipt(trackingId: string): Promise<void> {
        return this.fakeApi(() => {
            this.requireLogin();
            const target = this._trackingNumber().find(t => t.id === trackingId);

            if (!target) throw new Error('Collo non trovato');
            if (target.status === 'Ricevuto') throw new Error('Collo già ricevuto');

            this._trackingNumber.update(list => list.map(t =>
                t.id === trackingId ? { ...t, status: 'Ricevuto' as const, receivedAt: this.nowIso() } : t
            ));
        });
    }

    /**
     * Invia l'ordine dell'Admin al magazzino centrale: crea una richiesta di riordino 'In attesa'
     * per ogni prodotto (stessa logica delle richieste delle sedi, visibili a Operator e Super Admin).
     * Tutto o niente: se un prodotto o una quantità non sono validi, non viene creata nessuna richiesta.
     * NON cambia le giacenze: la merce arriva solo con la ricezione.
     */
    async requestReorder(items: { productId: string; quantity: number }[]): Promise<ApprovalRequest[]> {
        return this.fakeApi(() => {
            const op = this.requireRole(['User', 'Admin']);
            if (items.length === 0) throw new Error('L\'ordine è vuoto');

            // map lancia l'errore prima di modificare qualsiasi dato
            const created: ApprovalRequest[] = items.map(item => {
                const product = this.getProduct(item.productId);
                if (!product) throw new Error('Prodotto non trovato');
                if (!Number.isInteger(item.quantity) || item.quantity <= 0) throw new Error('Quantità non valida');

                return {
                    id: this.newId(),
                    type: 'Riordino' as const,
                    description: `Riordino ${item.quantity} ${product.name}`,
                    requestedBy: op.id,
                    date: this.nowIso(),
                    status: 'In attesa' as const,
                    siteId: op.siteId, // sede che invia la richiesta
                    productId: item.productId,
                    quantity: item.quantity
                };
            });

            this._approvals.update(list => [...created, ...list]);
            return created;
        });
    }

    /** Richieste di token extra in attesa per una sede (stessa fonte per Admin, dashboard e Super Admin) */
    pendingTokenRequestsForSite(siteId: string | undefined): ApprovalRequest[] {
        if (!siteId) return [];
        return this._approvals().filter(a => {
            const requestSiteId = a.siteId ?? this._operators().find(o => o.id === a.requestedBy)?.siteId;
            return a.type === 'Token extra' && a.status === 'In attesa' && requestSiteId === siteId;
        });
    }

    /** Token massimi di un nucleo familiare (adulti e minori) */
    getMaxTokens(beneficiary: Beneficiary): number {
        return beneficiary.adults * TOKENS_PER_ADULTI + beneficiary.minors * TOKENS_PER_MINORI;
    }

    // --- RICHIESTE DI RIFORNITURA DELLE SEDI ---
    // Sedi da rifornire (tutte tranne la Metro)
    readonly distributionSites = computed(() => this._sites().filter(s => s.type !== 'Metro'));

    /**
     * Richieste di rifornimento inviate da una sede e ancora in attesa.
     * È l'UNICA fonte usata sia dal badge nella lista "Rifornitura sedi"
     * sia dalla pagina della singola sede: i due numeri sono sempre uguali.
     */
    restockRequestsForSite(siteId: string): ApprovalRequest[] {
        return this._approvals().filter(a => {
            // Per le richieste vecchie senza siteId si usa la sede di chi l'ha inviata
            const requestSiteId = a.siteId ?? this._operators().find(o => o.id === a.requestedBy)?.siteId;
            return a.type === 'Riordino' && a.status === 'In attesa' && requestSiteId === siteId;
        });
    }

    restockRequestCount(siteId: string): number {
        return this.restockRequestsForSite(siteId).length;
    }

    /**
     * Totale delle richieste di riordino di tutte le sedi.
     * Somma gli stessi conteggi dei badge della lista "Rifornitura sedi",
     * quindi i due numeri non possono andare fuori sincronia.
     */
    totalRestockRequestCount(): number {
        return this.distributionSites().reduce((sum, site) => sum + this.restockRequestCount(site.id), 0);
    }

    // --- STRUMENTI DI RESET E CONTROLLO DEMO ---
    setServiceDown(down: boolean): void {
        this._serviceDown.set(down);
    }

    resetDemoData(): void {
        const keys = ['products_v2', 'beneficiaries', 'deliveries', 'alerts', 'approvals_v3', 'shipments', 'duplicateWindow', 'operatorId', 'inventories_v2', 'trackingNumber_v2'];
        keys.forEach(key => {
            try { localStorage.removeItem(STORAGE_PREFIX + key); } catch { }
        });
        this._products.set(SEED_PRODUCTS);
        this._beneficiaries.set(SEED_BENEFICIARIES);
        this._deliveries.set(SEED_DELIVERIES);
        this._alerts.set(SEED_ALERTS);
        this._approvals.set(SEED_APPROVALS);
        this._shipments.set(SEED_SHIPMENTS);
        this._trackingNumber.set(SEED_TRACKING_NUMBER);
        this._inventories.set(SEED_INVENTORIES);
        this._duplicateWindowDays.set(DEFAULT_DUPLICATE_WINDOW_DAYS);
        this._currentOperatorId.set(null);
        this._selectedBeneficiaryId.set(null);
        this._cart.set([]);
        this._lastDelivery.set(null);
    }
    //AVAILABILITY EACH STORE

    private readonly _inventories = signal<SiteInventory[]>(this.load('inventories_v2', SEED_INVENTORIES));
    readonly inventories = this._inventories.asReadonly();

    // --- GIACENZE DELLA METRO (fonte unica per Super Admin e Operator) ---
    // Si aggiorna da sola quando cambia l'inventario (carichi, spedizioni...)
    readonly metroStock = computed<MetroStockItem[]>(() => {
        const metro = this._sites().find(s => s.type === 'Metro');
        return this._inventories()
            .filter(inv => inv.siteId === metro?.id)
            .map(inv => {
                const product = this._products().find(p => p.id === inv.productId);
                return {
                    productId: inv.productId,
                    name: product?.name ?? inv.productName,
                    category: product?.category ?? 'Altro',
                    icon: product?.icon ?? 'bag',
                    iconType: product?.iconType ?? 'bag',
                    price: product?.price ?? 0,
                    stock: inv.stock,
                    expiry: inv.expiry,
                    isExpiringSoon: inv.isExpiringSoon
                };
            });
    });

    // Somma delle giacenze di tutti i prodotti della metro (0 se vuota)
    readonly metroTotalStock = computed(() => this.metroStock().reduce((sum, i) => sum + i.stock, 0));

    /**
     * Articoli in scadenza di una sede, oppure di tutte le sedi (siteId = null).
     * Stessi record e stesso criterio (flag isExpiringSoon) usati dal conteggio delle dashboard.
     */
    expiringStock(siteId: string | null): ExpiringStockItem[] {
        return this._inventories()
            .filter(inv => inv.isExpiringSoon && (!siteId || inv.siteId === siteId))
            .map(inv => ({
                productId: inv.productId,
                name: this._products().find(p => p.id === inv.productId)?.name ?? inv.productName,
                siteName: this.getSiteName(inv.siteId),
                stock: inv.stock,
                expiry: inv.expiry
            }));
    }



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