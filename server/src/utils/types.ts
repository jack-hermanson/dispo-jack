import {Request} from "express";

export type DbDialect = "sqlite" | "postgres";

export interface AuthRequest<T> extends Request<T> {
    account?: Account;
}
