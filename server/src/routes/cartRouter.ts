import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { auth } from "../middleware/auth";
import { validateRequest, HTTP, sendError } from "jack-hermanson-ts-utils";
import { cartSchema } from "../models/Cart";
import { CartRecord, CartRequest } from "../../../shared/resource_models/cart";
import { CartService } from "../services/CartService";

export const cartRouter = express.Router();

cartRouter.post(
    "/",
    async (req: AuthRequest<CartRequest>, res: Response<CartRecord>) => {
        try {
            // check required parameters
            if (!(await validateRequest(cartSchema, req, res))) return;
            const cartRequest: CartRequest = req.body;

            const cart = await CartService.create(cartRequest, res);
            if (!cart) {
                return;
            }

            res.json(cart);
        } catch (error) {
            sendError(error, res);
        }
    }
);
