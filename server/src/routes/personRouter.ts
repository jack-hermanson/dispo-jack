import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { PersonService } from "../services/PersonService";
import { PersonRequest, personSchema } from "../models/Person";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import { PersonRecord } from "../../../shared/resource_models/person";

export const personRouter = express.Router();

personRouter.post(
    "/",
    async (req: AuthRequest<PersonRequest>, res: Response<PersonRecord>) => {
        try {
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
    async (req: AuthRequest<any>, res: Response<PersonRecord[]>) => {
        try {
            res.json(await PersonService.getPeople());
        } catch (error) {
            sendError(error, res);
        }
    }
);

personRouter.get(
    "/:id",
    async (req: AuthRequest<{ id: number }>, res: Response<PersonRecord>) => {
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
    async (
        req: AuthRequest<{ id: number } & PersonRequest>,
        res: Response<PersonRecord>
    ) => {
        try {
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
