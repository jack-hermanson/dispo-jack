import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { PersonService } from "../services/PersonService";
import { personSchema } from "../models/Person";
import { PersonRequest } from "../../../shared/resource_models/person";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import { PersonRecord } from "../../../shared/resource_models/person";
import { auth } from "../middleware/auth";
import { RoleService } from "../services/RoleService";
import { AccountService } from "../services/AccountService";

export const personRouter = express.Router();

personRouter.post(
    "/",
    auth,
    async (req: AuthRequest<PersonRequest>, res: Response<PersonRecord>) => {
        try {
            if (!(await RoleService.hasMinClearance(req.account.id, 5, res))) {
                res.sendStatus(HTTP.FORBIDDEN);
                return;
            }

            // check for required parameters
            if (!(await validateRequest(personSchema, req, res))) return;
            const requestBody: PersonRequest = req.body;

            // create record
            const newPerson = await PersonService.createPerson(
                requestBody,
                res
            );
            if (!newPerson) return;

            res.status(HTTP.CREATED).json(newPerson);
        } catch (error) {
            sendError(error, res);
        }
    }
);

personRouter.get(
    "/",
    auth,
    async (req: AuthRequest<any>, res: Response<PersonRecord[]>) => {
        if (!(await RoleService.hasMinClearance(req.account.id, 2, res))) {
            res.sendStatus(HTTP.FORBIDDEN);
            return;
        }
        try {
            res.json(await PersonService.getPeople());
        } catch (error) {
            sendError(error, res);
        }
    }
);

personRouter.get(
    "/filter",
    auth,
    async (req: AuthRequest<any>, res: Response<PersonRecord[]>) => {
        res.json(await PersonService.filter(req.query.q as string));
    }
);

personRouter.get(
    "/:id",
    auth,
    async (req: AuthRequest<{ id: number }>, res: Response<PersonRecord>) => {
        if (!(await RoleService.hasMinClearance(req.account.id, 2, res))) {
            res.sendStatus(HTTP.FORBIDDEN);
            return;
        }

        try {
            const person = await PersonService.getOnePerson(req.params.id, res);
            if (!person) return;
            res.json(person);
        } catch (error) {
            sendError(error, res);
        }
    }
);

personRouter.put(
    "/:id",
    auth,
    async (
        req: AuthRequest<{ id: number } & PersonRequest>,
        res: Response<PersonRecord>
    ) => {
        try {
            if (!(await RoleService.hasMinClearance(req.account.id, 2, res))) {
                res.sendStatus(HTTP.FORBIDDEN);
                return;
            }

            // check for required parameters
            if (!(await validateRequest(personSchema, req, res))) return;
            const requestBody: PersonRequest = req.body;

            // edit record
            const editedPerson = await PersonService.editPerson(
                req.params.id,
                requestBody,
                res
            );
            if (!editedPerson) return;

            res.json(editedPerson);
        } catch (error) {
            sendError(error, res);
        }
    }
);
