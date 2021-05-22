import {BaseModel} from "./_baseModel";
import {PersonRecord} from "./person";

export interface AccountRequest {
    username: string;
    email: string;
    password: string;
    token?: string;
}

export interface AccountRecord extends AccountRequest, BaseModel {}

export interface AccountAndPerson {
    account: AccountRecord;
    person: PersonRecord;
}

export interface LoginRequest {
    username: string;
    password: string;
}
