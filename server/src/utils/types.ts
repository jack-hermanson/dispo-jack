import {Request} from "express";
import {HTTP_STATUS} from "./constants";

export type DbDialect = "sqlite" | "postgres";

export interface AuthRequest<T> extends Request<T> {
    account?: Account;
}

export class HttpError {
    public status: HTTP_STATUS;
    public message?: string;
    public error?: Error;
}
