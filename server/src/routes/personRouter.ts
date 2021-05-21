import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {createPerson, getOnePerson, getPeople} from "../services/personServices";
import {sendError} from "../utils/functions";
import {PersonRequest, personSchema} from "../entities/Person";
import {validateRequest} from "../utils/validation";
import {HTTP_STATUS} from "../utils/constants";

export const personRouter = express.Router();

personRouter.post("/", async (req: AuthRequest<PersonRequest>, res: Response) => {
    try {
        // check for required parameters
        if (!await validateRequest(personSchema, req, res)) return;
        const requestBody: PersonRequest = req.body;

        // create record
        const newPerson = await createPerson(requestBody, res);
        if (!newPerson) return;

        res.status(HTTP_STATUS.CREATED).json(newPerson);
    } catch (error) {
        sendError(error, res);
    }
});

personRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    try {
        res.json(await getPeople());
    } catch (error) {
        sendError(error, res);
    }
});

personRouter.get("/:id", async (req: AuthRequest<{ id: number; }>, res: Response) => {
    try {
        const person = await getOnePerson(req.params.id, res);
        if (!person) return;
        res.json(person);
    } catch (error) {
        sendError(error, res);
    }
});
