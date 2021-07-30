import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import { cartBatchSchema } from "../models/CartBatch";
import {
    CartBatchRequest,
    CartBatchRecord,
} from "../../../shared/resource_models/cartBatch";
import { CartBatchService } from "../services/CartBatchService";

export const cartBatchRouter = express.Router();

cartBatchRouter.post(
    "/",
    async (
        req: AuthRequest<CartBatchRequest>,
        res: Response<CartBatchRecord>
    ) => {
        try {
            // check required parameters
            if (!(await validateRequest(cartBatchSchema, req, res))) return;
            const cartBatchRequest: CartBatchRequest = req.body;

            const cartBatch = await CartBatchService.create(
                cartBatchRequest,
                res
            );
            if (!cartBatch) return;

            res.status(HTTP.CREATED).json(cartBatch);
        } catch (error) {
            sendError(error, res);
        }
    }
);
