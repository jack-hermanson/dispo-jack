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
import { Socket } from "socket.io";
import { SocketEvent } from "../../../shared/enums";

export const batchRouter = express.Router();

batchRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    res.json(await BatchService.getAll());
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
            const newBatch = await BatchService.create(requestBody, res);
            if (!newBatch) return;

            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_BATCHES);

            res.status(HTTP.CREATED).json(newBatch);
        } catch (error) {
            sendError(error, res);
        }
    }
);

batchRouter.delete(
    "/:id",
    auth,
    async (req: AuthRequest<{ id: number }>, res: Response<boolean>) => {
        try {
            if (!(await RoleService.hasMinClearance(req.account.id, 5, res))) {
                return;
            }
            const id = req.params.id;
            const deleted = await BatchService.delete(id, res);
            if (!deleted) {
                return;
            }

            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_BATCHES);

            res.json(true);
        } catch (error) {
            sendError(error, res);
        }
    }
);
