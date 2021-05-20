import Joi from "joi";
import {AuthRequest} from "./types";
import {Response} from "express";
import {HTTP_STATUS} from "./constants";

/*
If the request is not valid, it will send a 400 response with details and return false.
Otherwise, it will return true.
 */
export const validateRequest = async (schema: Joi.Schema,
                                      req: AuthRequest<any>, res: Response): Promise<boolean> => {
    try {
        await schema.validateAsync(req.body);
        return true;
    } catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(error.details.map(err => err.message));
        return false;
    }
}
