import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {StrainTypeRequest, strainTypeSchema} from "../entities/StrainType";
import {auth} from "../middleware/auth";
import {sendError} from "../utils/functions";
import {validateRequest} from "../utils/validation";
import {hasMinClearance} from "../services/roleServices";
import {HTTP_STATUS} from "../utils/constants";
import {createStrain, createStrainType, getStrains, getStrainTypes} from "../services/strainServices";
import {StrainRequest, strainSchema} from "../entities/Strain";
import {StrainRecord} from "../../../client/src/data/strain";

export const strainRouter = express.Router();

strainRouter.post("/strain-type", auth, async (req: AuthRequest<StrainTypeRequest>, res: Response) => {
    try {
        // check permissions
        if (!await hasMinClearance(req.account.id, 5, res)) return;

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

strainRouter.post("/", auth, async (req: AuthRequest<StrainRequest>, res: Response) => {
    try {
        // check permissions
        if (!await hasMinClearance(req.account.id, 5, res)) return;

        // check required parameters
        if (!await validateRequest(strainSchema, req, res)) return;
        const requestBody: StrainRequest = req.body;

        // create record
        const newStrain = await createStrain(requestBody, res);
        if (!newStrain) return;

        res.status(HTTP_STATUS.CREATED).json(newStrain);
    } catch (error) {
        sendError(error, res);
    }
});

strainRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    res.json(await getStrains());
});

strainRouter.put("/:id", auth, async (req: AuthRequest<StrainRequest>, res: Response) => {
    res.json({});
});
