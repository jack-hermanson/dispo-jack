import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {NewAccountRequest, newAccountSchema, RegisterRequest, registerSchema} from "../entities/Account";
import {validateRequest} from "../utils/validation";
import {createAccount, getAccounts, getOneAccount, register} from "../services/accountServices";
import {sendError} from "../utils/functions";
import {PersonRequest, personSchema} from "../entities/Person";

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
})

