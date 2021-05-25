import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {StrainTypeRequest, strainTypeSchema} from "../entities/StrainType";
import {auth} from "../middleware/auth";
import {sendError} from "../utils/functions";
import {validateRequest} from "../utils/validation";
import {getUserClearances} from "../services/roleServices";
import {HTTP_STATUS} from "../utils/constants";
import {createStrainType, getStrainTypes} from "../services/strainServices";

export const strainRouter = express.Router();

strainRouter.post("/strain-type", auth, async (req: AuthRequest<StrainTypeRequest>, res: Response) => {
    try {
        // check permissions
        const clearances = await getUserClearances(req.account.id);
        if (!clearances.some(clearance => clearance >= 5)) {
            res.status(HTTP_STATUS.FORBIDDEN).send("Only admins can create strain types.");
            return;
        }

        // check required parameters
        if (!await validateRequest(strainTypeSchema, req, res)) return;
        const requestBody: StrainTypeRequest = req.body;

        // create record
        const newStrainType = await createStrainType(requestBody, res);
        if (!newStrainType) return;

        res.status(HTTP_STATUS.CREATED).json(newStrainType);
    } catch (error) {
        sendError(error, res);
    }
});

strainRouter.get("/strain-type", async (req: AuthRequest<any>, res: Response) => {
    res.json(await getStrainTypes());
});
