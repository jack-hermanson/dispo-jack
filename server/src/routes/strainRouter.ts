import express, {Response} from "express";
import {AuthRequest} from "../utils/types";

export const strainRouter = express.Router();

strainRouter.get("/", (req: AuthRequest<any>, res: Response) => {
    res.json({});
});
