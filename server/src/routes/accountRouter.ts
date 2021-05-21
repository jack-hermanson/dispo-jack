import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {
    LoginRequest,
    loginSchema,
    NewAccountRequest,
    newAccountSchema,
    RegisterRequest,
    registerSchema
} from "../entities/Account";
import {validateRequest} from "../utils/validation";
import {createAccount, getAccounts, getOneAccount, login, logout, register} from "../services/accountServices";
import {sendError} from "../utils/functions";
import {auth} from "../middleware/auth";

export const accountRouter = express.Router();

// new account
accountRouter.post("/", async (req: AuthRequest<NewAccountRequest>, res: Response) => {
    try {
        if (!await validateRequest(newAccountSchema, req, res)) return;
        const requestBody: NewAccountRequest = req.body;
        const accountAndPerson = await createAccount(requestBody, res);
        if (!accountAndPerson) return;
        res.status(HTTP_STATUS.CREATED).json(accountAndPerson);
    } catch (error) {
        sendError(error, res);
    }
});

accountRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    try {
        res.json(await getAccounts());
    } catch (error) {
        sendError(error, res);
    }
});

accountRouter.get("/:id", async (req: AuthRequest<{ id: number; }>, res: Response) => {
    try {
        const accountAndPerson = await getOneAccount(req.params.id, res);
        if (!accountAndPerson) return;
        res.json(accountAndPerson);
    } catch (error) {
        sendError(error, res);
    }
});

// new account and new person
accountRouter.post("/register", async (req: AuthRequest<RegisterRequest>, res: Response) => {
    try {
        if (!await validateRequest(registerSchema, req, res)) return;
        const requestBody: RegisterRequest = req.body;
        const accountAndPerson = await register(requestBody, res);
        if (!accountAndPerson) return;
        res.status(HTTP_STATUS.CREATED).json(accountAndPerson);
    } catch (error) {
        sendError(error, res);
    }
});

// log in
accountRouter.post("/login", async (req: AuthRequest<LoginRequest>, res: Response) => {
    try {
        if (!await validateRequest(loginSchema, req, res)) return;
        const requestBody: LoginRequest = req.body;
        const accountAndPerson = await login(requestBody, res);
        res.json(accountAndPerson);
    } catch (error) {
        sendError(error, res);
    }
});

// log out
accountRouter.post("/logout", auth, async (req: AuthRequest<any>, res: Response) => {
    try {
        const successfulLogout = await logout(req, res);
        if (!successfulLogout) return;
        res.sendStatus(HTTP_STATUS.OK);
    } catch (error) {
        sendError(error, res);
    }
});
