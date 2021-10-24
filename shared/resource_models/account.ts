import { ResourceModel } from "./_base";
import { PersonRecord, PersonRequest } from "./person";

export interface AccountRequest {
    username: string;
    email: string;
    password: string;
    token?: string;
}

export interface AccountRecord extends AccountRequest, ResourceModel {}

export interface AccountAndPerson {
    account: AccountRecord;
    person: PersonRecord;
    clearances: number[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface EditAccountRequest {
    username: string;
    email: string;
    personId: number;
}

export interface NewAccountRequest extends EditAccountRequest {
    password: string;
}

export interface RegisterRequest
    extends Omit<NewAccountRequest, "personId">,
        PersonRequest {}

export interface TokenLoginRequest {
    token: string;
}
