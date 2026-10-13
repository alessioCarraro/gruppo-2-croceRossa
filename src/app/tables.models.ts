type UUID = string;

const enum TypeOfOrganization {
    Metro,
    EnteDistributore
}

const enum TypeOfMeasurementUnit {
    Kg,
    Litro,
    Sacco,
    Pacco,
    Scatola
}

const enum TypeOfProductCategory {
    Alimenti,
    Abbigliamento,
    Igiene,
    Altro
}

export interface User {
    id: UUID;
    username: string;
    password: string;
    is_active: boolean;
    can_login: boolean;
}

export interface Operator {
    id: UUID;
    first_name: string;
    last_name: string;
    tax_code: string;
    email: string;
}

export interface Organization {
    id: UUID;
    name: string;
    type: TypeOfOrganization;
    address: string;
    city: string;
    province: string;
}

export interface Product {
    id: UUID;
    sku_code: string;
    name: string;
    category_id: TypeOfProductCategory;
    beneficiary_max: number;
    beneficiary_organization: number;
    measurement_unit: TypeOfMeasurementUnit;
}

export interface TrackingNumber {
    id: UUID;
    tracking_number: string;
    from_organization: Organization;
    to_organization: Organization;
}

export interface Beneficiary {
    id: UUID;
    first_name: string;
    last_name: string;
    tax_code: string;
    birth_place: string;
    birth_date: Date;    
}

export interface User {}
export interface User {}
export interface User {}
export interface User {}
export interface User {}