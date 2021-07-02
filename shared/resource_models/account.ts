import { ResourceModel } from "./_base";
import { PersonRecord } from "./person";

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
