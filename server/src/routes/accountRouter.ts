import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {NewAccountRequest, newAccountSchema} from "../entities/Account";
import {validateRequest} from "../utils/validation";
import {createAccount} from "../services/accountServices";

export const accountRouter = express.Router();

// new account
accountRouter.post("/", async (req: AuthRequest<NewAccountRequest>, res: Response) => {
    // todo
    try {
        if (!await validateRequest(newAccountSchema, req, res)) return;
        const requestBody: NewAccountRequest = req.body;
        const account = await createAccount(requestBody);
        res.status(HTTP_STATUS.CREATED).json(account);
    } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

