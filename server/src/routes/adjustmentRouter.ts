import express, { Response } from "express";
import { AuthRequest } from "../utils/types";

export const adjustmentRouter = express.Router();

adjustmentRouter.get("/", (req: AuthRequest<any>, res: Response) => {
    res.json({ ok: true });
});
