import { Request } from "express";
import { Person } from "../models/Person";
import { Account } from "../models/Account";

export type DbDialect = "sqlite" | "postgres";

export interface AuthRequest<T> extends Request<T> {
    account?: Account;
}

export interface AccountAndPersonType {
    account: Account;
    person: Person;
    clearances: number[];
}
