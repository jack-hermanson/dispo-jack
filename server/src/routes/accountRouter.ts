import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {NewAccountRequest, newAccountSchema} from "../entities/Account";
import {validateRequest} from "../utils/validation";
import {createAccount} from "../services/accountServices";
import {sendError} from "../utils/functions";

export const accountRouter = express.Router();

// new account
accountRouter.post("/", async (req: AuthRequest<NewAccountRequest>, res: Response) => {
    try {
        if (!await validateRequest(newAccountSchema, req, res)) return;
        const requestBody: NewAccountRequest = req.body;
        const accountAndPerson = await createAccount(requestBody, res);
        res.status(HTTP_STATUS.CREATED).json(accountAndPerson);
    } catch (error) {
        sendError(error, res);
    }
});

