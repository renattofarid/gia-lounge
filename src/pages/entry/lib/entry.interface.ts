import { Links, Meta } from "@/lib/global.interface";
import { Person, User } from "@/pages/auth/service/auth.interface";
import { EventItem } from "@/pages/events/lib/event.interface";

export interface EntryCollection {
    data:  EntryItem[];
    links: Links;
    meta:  Meta;
}

export interface EntryItem {
    id:             number;
    entry_datetime: Date;
    code_pay:       null;
    quantity:       string;
    status_pay:     string;
    status_entry:   string;
    user_id:        number;
    user:           User;
    person_id:      number;
    person:         Person;
    event_id:       number;
    event:          EventItem;
    code:           Code;
}

export interface Code {
    id:                number;
    description:       string;
    barcode_path:      null;
    qrcode_path:       string;
    reservation_id:    null;
    lottery_ticket_id: null;
    entry_id:          number;
    created_at:        Date;
    total_scans:       number;
    first_ok_scan:     FirstOkScan | null;
    last_scan_attempt: FirstOkScan | null;
}

export interface FirstOkScan {
    created_at: string;
}

// export interface Event {
//     id:             number;
//     name:           string;
//     event_datetime: Date;
//     comment:        string;
//     status:         EventStatus;
//     user_id:        number;
//     user:           EventUser;
//     company_id:     number;
//     company:        Company;
// }

// export interface Company {
//     id:            number;
//     ruc:           string;
//     business_name: BusinessName;
//     address:       Address;
//     phone:         string;
//     email:         Email;
//     route:         string;
//     status:        CompanyStatus;
// }

// export enum Address {
//     AVCallePrueba = "AV.Calle Prueba",
//     AVChinchaysuyo1217LaVictoria14008 = "Av. Chinchaysuyo 1217, La Victoria 14008",
// }

// export enum BusinessName {
//     GiaLounge = "Gia  Lounge",
//     MrSoft = "MR SOFT",
// }

// export enum Email {
//     GialoungeTestCOM = "gialounge@test.com",
//     MrsoftTestCOM = "mrsoft@test.com",
// }

// export enum CompanyStatus {
//     Activo = "Activo",
// }

// export enum EventStatus {
//     Finalizó = "Finalizó",
//     Próximo = "Próximo",
// }

// export interface EventUser {
//     id:        number;
//     name:      Name;
//     username:  Username;
//     person_id: number;
//     rol_id:    number;
//     person:    Person;
// }

// export enum Name {
//     Administrador = "ADMINISTRADOR",
// }

// export interface Person {
//     id:              number;
//     type_document:   TypeDocument;
//     type_person:     TypePerson;
//     number_document: string;
//     names:           Name;
//     father_surname:  string;
//     mother_surname:  string;
//     business_name:   string;
//     address:         string;
//     phone:           string;
//     email:           string;
//     occupation:      null;
//     status:          CompanyStatus;
// }

// export enum TypeDocument {
//     Dni = "DNI",
// }

// export enum TypePerson {
//     Natural = "NATURAL",
// }

// export enum Username {
//     Admin = "admin",
// }

// export enum StatusEntry {
//     NoIngresado = "No Ingresado",
// }

// export enum StatusPay {
//     Pagado = "Pagado",
//     Pendiente = "Pendiente",
// }

// export interface DatumUser {
//     id:         number;
//     name:       Name;
//     username:   Username;
//     status:     CompanyStatus;
//     person_id:  number;
//     rol_id:     number;
//     created_at: null;
//     updated_at: null;
//     deleted_at: null;
// }

