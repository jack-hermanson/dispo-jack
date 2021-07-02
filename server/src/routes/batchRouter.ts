import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { auth } from "../middleware/auth";
import { validateRequest } from "jack-hermanson-ts-utils";
import { hasMinClearance } from "../services/roleServices";
import { HTTP_STATUS } from "../utils/constants";
import { sendError } from "../utils/functions";
import { createBatch, getBatches } from "../services/batchServices";
import { BatchRequest, batchSchema } from "../entities/Batch";

export const batchRouter = express.Router();

batchRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    res.json(await getBatches());
});

batchRouter.post(
    "/",
    auth,
    async (req: AuthRequest<BatchRequest>, res: Response) => {
        try {
            // check permissions
            if (!(await hasMinClearance(req.account.id, 5, res))) return;

            // check required parameters
            if (!(await validateRequest(batchSchema, req, res))) return;
            const requestBody: BatchRequest = req.body;

            // create new record
            const newBatch = await createBatch(requestBody, res);
            if (!newBatch) return;

            res.status(HTTP_STATUS.CREATED).json(newBatch);
        } catch (error) {
            sendError(error, res);
        }
    }
);
