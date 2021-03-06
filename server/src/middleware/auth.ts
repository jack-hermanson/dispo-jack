import { AuthRequest } from "../utils/types";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";
import * as jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { Account } from "../models/Account";

export const auth = async (
    req: AuthRequest<any>,
    res: Response,
    next: () => any
) => {
    try {
        if (!req.header("Authentication")) {
            res.status(HTTP.BAD_REQUEST).send("No Authentication header!");
        }
        const token = req.header("Authentication").replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as {
            id: number;
        };

        const connection = getConnection();
        const accountRepo = connection.getRepository(Account);
        const account = await accountRepo.findOne({
            id: decodedToken.id,
            token: token,
        });
        if (!account) {
            return res.status(HTTP.UNAUTHORIZED).send("Bad token or ID.");
        }
        req.account = account;
        next();
    } catch (error) {
        res.status(HTTP.UNAUTHORIZED).json(error);
    }
};
