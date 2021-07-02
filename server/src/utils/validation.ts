import Joi from "joi";
import { AuthRequest } from "./types";
import { Response } from "express";
import { HTTP_STATUS } from "./constants";
import { Repository } from "typeorm";

/*
If the request is not valid, it will send a 400 response with details and return false.
Otherwise, it will return true.
 */
export const validateRequest = async (
    schema: Joi.Schema,
    req: AuthRequest<any>,
    res: Response
): Promise<boolean> => {
    try {
        await schema.validateAsync(req.body);
        return true;
    } catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            error.details.map(err => err.message)
        );
        return false;
    }
};

interface RecordExistsProps<T> {
    repo: Repository<T>;
    properties: {
        name: string;
        value: any;
    }[];
    res: Response;
    existingRecord?: T;
}

/*
Returns true if it's okay to proceed with this operation because there is no conflict.
Returns false if there is a conflict and the operation must be aborted.
 */
export const doesNotConflict = async <T>({
    repo,
    properties,
    res,
    existingRecord,
}: RecordExistsProps<T>): Promise<boolean> => {
    const conflictingProperties: string[] = [];

    for (let pair of properties) {
        let conflict: boolean = false;
        const matchingRecord = await repo.findOne({ [pair.name]: pair.value });
        if (matchingRecord) {
            // a match exists
            if (existingRecord) {
                // are the match and the existing record the same thing?
                console.log("matching record id", matchingRecord["id"]);
                console.log("existing record id", existingRecord["id"]);
                conflict = matchingRecord["id"] !== existingRecord["id"];
            } else {
                // there is no existing record to compare against, and this is not unique
                conflict = true;
            }
        }
        if (conflict) {
            conflictingProperties.push(pair.name);
        }
    }

    if (conflictingProperties.length) {
        res.status(HTTP_STATUS.CONFLICT).json({ conflictingProperties });
    }

    return conflictingProperties.length === 0;
};
