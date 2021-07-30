import express, { Response } from "express";
import { AuthRequest } from "../utils/types";
import { auth } from "../middleware/auth";
import { HTTP, sendError, validateRequest } from "jack-hermanson-ts-utils";
import { cartSchema } from "../models/Cart";
import { CartRecord, CartRequest } from "../../../shared/resource_models/cart";
import { CartService } from "../services/CartService";
import { RoleService } from "../services/RoleService";

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

            res.status(HTTP.CREATED).json(cart);
        } catch (error) {
            sendError(error, res);
        }
    }
);

cartRouter.get(
    "/",
    auth,
    async (req: AuthRequest<any>, res: Response<CartRecord[]>) => {
        try {
            if (!(await RoleService.hasMinClearance(req.account.id, 2, res))) {
                return;
            }

            const carts = await CartService.getAll();
            res.json(carts);
        } catch (error) {
            sendError(error, res);
        }
    }
);
