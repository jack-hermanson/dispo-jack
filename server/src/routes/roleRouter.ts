import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { RoleRequest, Role, roleSchema } from "../entities/Role";
import { validateRequest } from "../utils/validation";
import { HTTP_STATUS } from "../utils/constants";
import {
    applyRole,
    createRole,
    editRole,
    getOneRole,
    getRoles,
    getUserRoles,
} from "../services/roleServices";
import { sendError } from "../utils/functions";
import { auth } from "../middleware/auth";
import { applyRoleSchema } from "../entities/AccountRole";

export const roleRouter = express.Router();

roleRouter.post("/", async (req: AuthRequest<Role>, res: Response) => {
    try {
        // check for required parameters
        if (!(await validateRequest(roleSchema, req, res))) return;
        const requestBody: RoleRequest = req.body;

        // create record
        const newRole = await createRole(requestBody, res);
        if (!newRole) return;

        res.status(HTTP_STATUS.CREATED).json(newRole);
    } catch (error) {
        sendError(error, res);
    }
});

roleRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    try {
        res.json(await getRoles());
    } catch (error) {
        sendError(error, res);
    }
});

roleRouter.put(
    "/:id",
    async (req: AuthRequest<{ id: number } & RoleRequest>, res: Response) => {
        try {
            // check for required parameters
            if (!(await validateRequest(roleSchema, req, res))) return;
            const requestBody: RoleRequest = req.body;

            // edit record
            const editedRole = await editRole(req.params.id, requestBody, res);
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
        res: Response
    ) => {
        try {
            // check for required parameters
            if (!(await validateRequest(applyRoleSchema, req, res))) return;

            const newAccountRole = await applyRole(
                req.body.accountId,
                req.body.roleId,
                res,
                req.account
            );
            if (!newAccountRole) return;
            res.status(HTTP_STATUS.CREATED).json(newAccountRole);
        } catch (error) {
            sendError(error, res);
        }
    }
);

// get user roles
roleRouter.get(
    "/user/:accountId",
    async (req: AuthRequest<any>, res: Response) => {
        const accountId = req.params.accountId;
        res.json(await getUserRoles(accountId));
    }
);

// get one role
roleRouter.get(
    "/:id",
    async (req: AuthRequest<{ id: number }>, res: Response) => {
        try {
            const role = await getOneRole(req.params.id, res);
            if (!role) return;
            res.json(role);
        } catch (error) {
            sendError(error, res);
        }
    }
);
