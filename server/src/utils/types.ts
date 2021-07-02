import { Request } from "express";
import { HTTP_STATUS } from "./constants";
import { Person } from "../entities/Person";
import { Account } from "../entities/Account";

export type DbDialect = "sqlite" | "postgres";

export interface AuthRequest<T> extends Request<T> {
    account?: Account;
}

export interface AccountAndPerson {
    account: Account;
    person: Person;
    clearances: number[];
}

export enum SocketEvent {
    STATUS = "status",
    STRAINS_UPDATE = "strainsUpdate",
}
