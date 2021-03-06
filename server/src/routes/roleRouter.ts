import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { roleSchema } from "../models/Role";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import { RoleService } from "../services/RoleService";
import { auth } from "../middleware/auth";
import { applyRoleSchema } from "../models/AccountRole";
import {
    AccountRoleRecord,
    RoleRecord,
    RoleRequest,
} from "../../../shared/resource_models/role";

export const roleRouter = express.Router();

roleRouter.post(
    "/",
    async (req: AuthRequest<RoleRequest>, res: Response<RoleRecord>) => {
        try {
            // check for required parameters
            if (!(await validateRequest(roleSchema, req, res))) return;
            const requestBody: RoleRequest = req.body;

            // create record
            const newRole = await RoleService.createRole(requestBody, res);
            if (!newRole) return;

            res.status(HTTP.CREATED).json(newRole);
        } catch (error) {
            sendError(error, res);
        }
    }
);

roleRouter.get(
    "/",
    async (req: AuthRequest<any>, res: Response<RoleRecord[]>) => {
        try {
            res.json(await RoleService.getRoles());
        } catch (error) {
            sendError(error, res);
        }
    }
);

roleRouter.put(
    "/:id",
    async (
        req: AuthRequest<{ id: number } & RoleRequest>,
        res: Response<RoleRecord>
    ) => {
        try {
            // check for required parameters
            if (!(await validateRequest(roleSchema, req, res))) return;
            const requestBody: RoleRequest = req.body;

            // edit record
            const editedRole = await RoleService.editRole(
                req.params.id,
                requestBody,
                res
            );
            if (!editedRole) return;

            res.json(editedRole);
        } catch (error) {
            sendError(error, res);
        }
    }
);

// todo delete role

// apply role to account
roleRouter.post(
    "/apply-role",
    auth,
    async (
        req: AuthRequest<{
            accountId: number;
            roleId: number;
        }>,
        res: Response<AccountRoleRecord>
    ) => {
        try {
            // check for required parameters
            if (!(await validateRequest(applyRoleSchema, req, res))) return;

            const newAccountRole = await RoleService.applyRole(
                req.body.accountId,
                req.body.roleId,
                res,
                req.account
            );
            if (!newAccountRole) return;
            res.status(HTTP.CREATED).json(newAccountRole);
        } catch (error) {
            sendError(error, res);
        }
    }
);

// get user roles
roleRouter.get(
    "/user/:accountId",
    async (req: AuthRequest<any>, res: Response<RoleRecord[]>) => {
        const accountId = req.params.accountId;
        res.json(await RoleService.getUserRoles(accountId));
    }
);

// get one role
roleRouter.get(
    "/:id",
    async (req: AuthRequest<{ id: number }>, res: Response<RoleRecord>) => {
        try {
            const role = await RoleService.getOneRole(req.params.id, res);
            if (!role) return;
            res.json(role);
        } catch (error) {
            sendError(error, res);
        }
    }
);
