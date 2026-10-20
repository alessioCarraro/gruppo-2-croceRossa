// ==========================================================================
// DATI DI PROVA - SOLO PER TEST
// Richieste di riordino di esempio per ogni sede (3-4 per sede).
// Per toglierli: elimina questo file e le 2 righe marcate "DATI DI PROVA" in utils.ts.
// ==========================================================================
import type { ApprovalRequest } from '../utils';

// Sedi
const LEGNANO = '4e81f18f-a6af-45a9-adbe-d82dd95d6b44';
const PARABIAGO = 'c9ea7b0d-2a83-47a7-bc69-f2f024392a7f';
const BUSTO_ARSIZIO = '502231c0-021d-42c1-9f3c-0ab1f15fca8f';

// Prodotti del catalogo
const PASTA_SEMOLA = '4b45aa99-76d8-4eb9-acbc-87e300c197f0';
const PASTA_INTEGRALE = 'edff434d-ceab-490a-9bba-b47366139ce2';
const PASSATA = '4396be27-f626-4032-8db2-18cbbb56d26a';
const PETTO_POLLO = 'e8f3375e-63d7-4171-8c1b-d92af7cd5229';
const OMOGENEIZZATO = '61321c12-9f01-4493-95f6-e7406296257b';

// Utente che "invia" le richieste di prova
const REQUESTER = 'fd73fe4a-d415-4b92-8ca6-ed4d4b2792f2';

/** Crea una richiesta di riordino di prova (stato "In attesa") */
function mockRequest(id: string, siteId: string, productId: string, quantity: number, description: string, date: string): ApprovalRequest {
    return { id, type: 'Riordino', description, requestedBy: REQUESTER, date, status: 'In attesa', siteId, productId, quantity };
}

// Legnano ha già nei dati iniziali il riordino di "Omogeneizzato carne": qui ne aggiungiamo altre 3
export const MOCK_RESTOCK_REQUESTS: ApprovalRequest[] = [
    // Legnano
    mockRequest('mock-req-legnano-1', LEGNANO, PASTA_SEMOLA, 80, 'Riordino 80 Pasta di semola 500g', '2026-10-16T08:00:00.000Z'),
    mockRequest('mock-req-legnano-2', LEGNANO, PASTA_INTEGRALE, 40, 'Riordino 40 Pasta integrale 500g', '2026-10-16T09:00:00.000Z'),
    mockRequest('mock-req-legnano-3', LEGNANO, PETTO_POLLO, 10, 'Riordino 10 Petto di pollo 1kg', '2026-10-16T10:00:00.000Z'),

    // Parabiago
    mockRequest('mock-req-parabiago-1', PARABIAGO, PASTA_SEMOLA, 60, 'Riordino 60 Pasta di semola 500g', '2026-10-17T08:00:00.000Z'),
    mockRequest('mock-req-parabiago-2', PARABIAGO, PASSATA, 50, 'Riordino 50 Passata di pomodoro 700g', '2026-10-17T09:00:00.000Z'),
    mockRequest('mock-req-parabiago-3', PARABIAGO, PETTO_POLLO, 15, 'Riordino 15 Petto di pollo 1kg', '2026-10-17T10:00:00.000Z'),
    mockRequest('mock-req-parabiago-4', PARABIAGO, OMOGENEIZZATO, 30, 'Riordino 30 Omogeneizzato carne', '2026-10-17T11:00:00.000Z'),

    // Busto Arsizio
    mockRequest('mock-req-busto-1', BUSTO_ARSIZIO, PASTA_SEMOLA, 70, 'Riordino 70 Pasta di semola 500g', '2026-10-18T08:00:00.000Z'),
    mockRequest('mock-req-busto-2', BUSTO_ARSIZIO, PASTA_INTEGRALE, 35, 'Riordino 35 Pasta integrale 500g', '2026-10-18T09:00:00.000Z'),
    mockRequest('mock-req-busto-3', BUSTO_ARSIZIO, PASSATA, 45, 'Riordino 45 Passata di pomodoro 700g', '2026-10-18T10:00:00.000Z'),
    mockRequest('mock-req-busto-4', BUSTO_ARSIZIO, OMOGENEIZZATO, 20, 'Riordino 20 Omogeneizzato carne', '2026-10-18T11:00:00.000Z'),
];
