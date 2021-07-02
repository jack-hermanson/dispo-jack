import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { auth } from "../middleware/auth";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import { RoleService } from "../services/RoleService";
import { BatchService } from "../services/BatchService";
import { batchSchema } from "../models/Batch";
import {
    BatchRecord,
    BatchRequest,
} from "../../../shared/resource_models/batch";

export const batchRouter = express.Router();

batchRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    res.json(await BatchService.getBatches());
});

batchRouter.post(
    "/",
    auth,
    async (req: AuthRequest<BatchRequest>, res: Response<BatchRecord>) => {
        try {
            // check permissions
            if (!(await RoleService.hasMinClearance(req.account.id, 5, res))) {
                return;
            }

            // check required parameters
            if (!(await validateRequest(batchSchema, req, res))) return;
            const requestBody: BatchRequest = req.body;

            // create new record
            const newBatch = await BatchService.createBatch(requestBody, res);
            if (!newBatch) return;

            res.status(HTTP.CREATED).json(newBatch);
        } catch (error) {
            sendError(error, res);
        }
    }
);
