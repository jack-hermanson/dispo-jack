import express, { Response } from "express";

export const mainRouter = express.Router();

mainRouter.get("/", async (req, res: Response) => {
    res.send("Okay!");
});
