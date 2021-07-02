import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import {
    LoginRequest,
    loginSchema,
    NewAccountRequest,
    newAccountSchema,
    RegisterRequest,
    registerSchema,
} from "../models/Account";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import {
    createAccount,
    getAccounts,
    getOneAccount,
    login,
    logout,
    register,
} from "../services/accountServices";
import { auth } from "../middleware/auth";
import { AccountAndPerson } from "../../../shared/resource_models/account";

export const accountRouter = express.Router();

// new account
accountRouter.post(
    "/",
    async (
        req: AuthRequest<NewAccountRequest>,
        res: Response<AccountAndPerson>
    ) => {
        try {
            if (!(await validateRequest(newAccountSchema, req, res))) return;
            const requestBody: NewAccountRequest = req.body;
            const accountAndPerson = await createAccount(requestBody, res);
            if (!accountAndPerson) return;
            res.status(HTTP.CREATED).json(accountAndPerson);
        } catch (error) {
            sendError(error, res);
        }
    }
);

accountRouter.get(
    "/",
    async (req: AuthRequest<any>, res: Response<AccountAndPerson[]>) => {
        try {
            res.json(await getAccounts());
        } catch (error) {
            sendError(error, res);
        }
    }
);

accountRouter.get(
    "/:id",
    async (
        req: AuthRequest<{ id: number }>,
        res: Response<AccountAndPerson>
    ) => {
        try {
            const accountAndPerson = await getOneAccount(req.params.id, res);
            if (!accountAndPerson) return;
            res.json(accountAndPerson);
        } catch (error) {
            sendError(error, res);
        }
    }
);

// new account and new person
accountRouter.post(
    "/register",
    async (
        req: AuthRequest<RegisterRequest>,
        res: Response<AccountAndPerson>
    ) => {
        try {
            if (!(await validateRequest(registerSchema, req, res))) return;
            const requestBody: RegisterRequest = req.body;
            const accountAndPerson = await register(requestBody, res);
            if (!accountAndPerson) return;
            res.status(HTTP.CREATED).json(accountAndPerson);
        } catch (error) {
            sendError(error, res);
        }
    }
);

// log in
accountRouter.post(
    "/login",
    async (req: AuthRequest<LoginRequest>, res: Response<AccountAndPerson>) => {
        try {
            if (!(await validateRequest(loginSchema, req, res))) return;
            const requestBody: LoginRequest = req.body;
            const accountAndPerson = await login(requestBody, res);
            res.json(accountAndPerson);
        } catch (error) {
            sendError(error, res);
        }
    }
);

// log out
accountRouter.post(
    "/logout",
    auth,
    async (req: AuthRequest<any>, res: Response<null>) => {
        try {
            const successfulLogout = await logout(req, res);
            if (!successfulLogout) return;
            res.sendStatus(HTTP.OK);
        } catch (error) {
            sendError(error, res);
        }
    }
);
