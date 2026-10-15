// import { DecimalPipe } from "@angular/common";

// type UUID = string;

// const enum TypeOfOrganization {
//     Metro,
//     EnteDistributore
// }

// const enum TypeOfMeasurementUnit {
//     Kg,
//     Litro,
//     Sacco,
//     Pacco,
//     Scatola
// }

// const enum TypeOfProductCategory {
//     Alimenti,
//     Abbigliamento,
//     Igiene,
//     Altro
// }

// const enum TypeOfBeneficicaryStatus {
//     Attivo,
//     Sospeso,
//     Scaduto
// }

// export interface User {
//     id: UUID;
//     username: string;
//     password: string;
//     is_active: boolean;
//     can_login: boolean;
// }

// export interface Operator {
//     id: UUID;
//     first_name: string;
//     last_name: string;
//     tax_code: string;
//     email: string;
//     birth_place: string;
//     birth_date: Date;
// }

// export interface Organization {
//     id: UUID;
//     name: string;
//     type: TypeOfOrganization;
//     address: string;
//     city: string;
//     province: string;
// }

// export interface Product {
//     id: UUID;
//     name: string;
//     category_id: TypeOfProductCategory;
//     stock: number;
//     cost: number;
//     expiration: Date;
//     beneficiary_max: number;
//     beneficiary_organization: number;
//     measurement_unit: TypeOfMeasurementUnit;
// }

// export interface TrackingNumber {
//     id: UUID;
//     tracking_number: string;
//     from_organization: Organization;
//     to_organization: Organization;
// }

// export interface Beneficiary {
//     id: UUID;
//     first_name: string;
//     last_name: string;
//     tax_code: string;
//     birth_place: string;
//     birth_date: Date;
//     has_allergies: boolean;   
//     has_intolerances: boolean;
//     religion: string;
//     token: DecimalPipe;
//     status: TypeOfBeneficicaryStatus;
//     log: BeneficiaryLog[];
// }

// export interface BeneficiaryLog {}

// export interface User {}
// export interface User {}
// export interface User {}
// export interface User {}