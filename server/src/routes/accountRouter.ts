import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {NewAccountRequest, newAccountSchema} from "../entities/Account";
import {validateRequest} from "../utils/validation";

export const accountRouter = express.Router();

// new account
accountRouter.post("/", async (req: AuthRequest<NewAccountRequest>, res: Response) => {
    if (!await validateRequest(newAccountSchema, req, res)) return;
    res.json(req.body);
});

