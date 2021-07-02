import { Response } from "express";
import { HTTP_STATUS } from "./constants";

export const sendError = (error: Error, res: Response) => {
    console.error(error);
    res.status(HTTP_STATUS.SERVER_ERROR).json(error);
};
