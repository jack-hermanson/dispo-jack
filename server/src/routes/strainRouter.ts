import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { SocketEvent } from "../../../shared/enums";
import { strainTypeSchema } from "../models/StrainType";
import { StrainTypeRequest } from "../../../shared/resource_models/strainType";
import { auth } from "../middleware/auth";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import { RoleService } from "../services/RoleService";
import { strainSchema } from "../models/Strain";
import { Socket } from "socket.io";
import { StrainTypeRecord } from "../../../shared/resource_models/strainType";
import { StrainRecord } from "../../../shared/resource_models/strain";
import { StrainRequest } from "../../../shared/resource_models/strain";
import { StrainService } from "../services/StrainService";
import { StrainTypeService } from "../services/StrainTypeService";

export const strainRouter = express.Router();

strainRouter.post(
    "/strain-type",
    auth,
    async (
        req: AuthRequest<StrainTypeRequest>,
        res: Response<StrainTypeRecord>
    ) => {
        try {
            // check permissions
            if (!(await RoleService.hasMinClearance(req.account.id, 5, res)))
                return;

            // check required parameters
            if (!(await validateRequest(strainTypeSchema, req, res))) return;
            const requestBody: StrainTypeRequest = req.body;

            // create record
            const newStrainType = await StrainTypeService.create(
                requestBody,
                res
            );
            if (!newStrainType) return;

            res.status(HTTP.CREATED).json(newStrainType);
        } catch (error) {
            sendError(error, res);
        }
    }
);

strainRouter.get(
    "/strain-type",
    async (req: AuthRequest<any>, res: Response<StrainTypeRecord[]>) => {
        res.json(await StrainTypeService.getAll());
    }
);

strainRouter.post(
    "/",
    auth,
    async (req: AuthRequest<StrainRequest>, res: Response<StrainRecord>) => {
        try {
            // check permissions
            if (!(await RoleService.hasMinClearance(req.account.id, 5, res)))
                return;

            // check required parameters
            if (!(await validateRequest(strainSchema, req, res))) return;
            const requestBody: StrainRequest = req.body;

            // create record
            const newStrain = await StrainService.create(requestBody, res);
            if (!newStrain) return;

            res.status(HTTP.CREATED).json(newStrain);
        } catch (error) {
            sendError(error, res);
        }
    }
);

strainRouter.get(
    "/",
    async (req: AuthRequest<any>, res: Response<StrainRecord[]>) => {
        res.json(await StrainService.getAll());
    }
);

strainRouter.put(
    "/:id",
    auth,
    async (
        req: AuthRequest<StrainRequest & { id: number }>,
        res: Response<StrainRecord>
    ) => {
        try {
            // check permissions
            if (!(await RoleService.hasMinClearance(req.account.id, 5, res)))
                return;

            // check required parameters
            if (!(await validateRequest(strainSchema, req, res))) return;
            const requestBody: StrainRequest = req.body;

            // edit
            const editedStrain = await StrainService.update(
                req.params.id,
                requestBody,
                res
            );
            if (!editedStrain) return;

            // socket
            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_STRAINS);

            // return data
            res.json(editedStrain);
        } catch (e) {
            sendError(e, res);
        }
    }
);
