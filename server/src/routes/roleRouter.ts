import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {RoleRequest, Role, roleSchema} from "../entities/Role";
import {validateRequest} from "../utils/validation";
import {HTTP_STATUS} from "../utils/constants";
import {createRole, editRole, getOneRole, getRoles} from "../services/roleServices";
import {sendError} from "../utils/functions";

export const roleRouter = express.Router();

roleRouter.post("/", async (req: AuthRequest<Role>, res: Response) => {
    try {
        // check for required parameters
        if (!await validateRequest(roleSchema, req, res)) return;
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

roleRouter.get("/:id", async (req: AuthRequest<{id: number}>, res: Response) => {
    try {
        const role = await getOneRole(req.params.id, res);
        if (!role) return;
        res.json(role);
    } catch (error) {
        sendError(error, res);
    }
});

roleRouter.put("/:id", async (req: AuthRequest<{id: number} & RoleRequest>, res: Response) => {
    try {
        // check for required parameters
        if (!await validateRequest(roleSchema, req, res)) return;
        const requestBody: RoleRequest = req.body;

        // create record
        const editedRole = await editRole(req.params.id, requestBody, res);
        if (!editedRole) return;

        res.json(editedRole);
    } catch (error) {
        sendError(error, res);
    }
});

// todo delete role
