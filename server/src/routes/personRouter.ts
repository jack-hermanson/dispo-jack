import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import {
    createPerson,
    editPerson,
    getOnePerson,
    getPeople,
} from "../services/personServices";
import { PersonRequest, personSchema } from "../entities/Person";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";

export const personRouter = express.Router();

personRouter.post(
    "/",
    async (req: AuthRequest<PersonRequest>, res: Response) => {
        try {
            // check for required parameters
            if (!(await validateRequest(personSchema, req, res))) return;
            const requestBody: PersonRequest = req.body;

            // create record
            const newPerson = await createPerson(requestBody, res);
            if (!newPerson) return;

            res.status(HTTP.CREATED).json(newPerson);
        } catch (error) {
            sendError(error, res);
        }
    }
);

personRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    try {
        res.json(await getPeople());
    } catch (error) {
        sendError(error, res);
    }
});

personRouter.get(
    "/:id",
    async (req: AuthRequest<{ id: number }>, res: Response) => {
        try {
            const person = await getOnePerson(req.params.id, res);
            if (!person) return;
            res.json(person);
        } catch (error) {
            sendError(error, res);
        }
    }
);

personRouter.put(
    "/:id",
    async (req: AuthRequest<{ id: number } & PersonRequest>, res: Response) => {
        try {
            // check for required parameters
            if (!(await validateRequest(personSchema, req, res))) return;
            const requestBody: PersonRequest = req.body;

            // edit record
            const editedPerson = await editPerson(
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
