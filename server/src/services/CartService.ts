import { getConnection, Repository } from "typeorm";
import { Response } from "express";
import { Cart } from "../models/Cart";
import { BatchRequest } from "../../../shared/resource_models/batch";
import { HTTP } from "jack-hermanson-ts-utils";
import { PersonService } from "./PersonService";
import { CartRequest } from "../../../shared/resource_models/cart";
import { CartBatchService } from "./CartBatchService";

const getRepos = (): {
    cartRepo: Repository<Cart>;
} => {
    const connection = getConnection();
    const cartRepo = connection.getRepository(Cart);
    return { cartRepo };
};

export abstract class CartService {
    static async getAll(): Promise<Cart[]> {
        const { cartRepo } = getRepos();
        return await cartRepo.find();
    }

    static async getOne(id: number, res: Response): Promise<Cart | undefined> {
        const { cartRepo } = getRepos();
        const cart = await cartRepo.findOne(id);
        if (!cart) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return cart;
    }

    static async getCustomerCarts(customerId: number): Promise<Cart[]> {
        const { cartRepo } = getRepos();
        return await cartRepo.find({ personId: customerId });
    }

    static async create(
        cartRequest: CartRequest,
        res: Response
    ): Promise<Cart | undefined> {
        const { cartRepo } = getRepos();

        // check if employeeId is legit
        if (cartRequest.employeeId) {
            const employee = PersonService.getOnePerson(
                cartRequest.employeeId,
                res
            );
            if (!employee) return undefined;
        }

        // check if personId is legit
        if (cartRequest.personId) {
            const customer = PersonService.getOnePerson(
                cartRequest.personId,
                res
            );
            if (!customer) return undefined;

            // clear existing carts, if any
            const existingCarts = await this.getCustomerCarts(
                cartRequest.personId
            );
            for (let cart of existingCarts) {
                const deleted = await this.delete(cart.id, res);
                if (!deleted) return undefined;
            }
        }

        // create record
        const cart = await cartRepo.save(cartRequest);
        return cart;
    }

    static async delete(
        cartId: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { cartRepo } = getRepos();

        // is cartId legit?
        const cart = await cartRepo.findOne(cartId);
        if (!cart) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        // delete cartBatches dependent on this cart
        const cartBatches = await CartBatchService.getCartBatches(cartId, res);
        for (let cartBatch of cartBatches) {
            const deleted = await CartBatchService.delete(cartBatch.id, res);
            if (!deleted) {
                return undefined;
            }
        }

        await cartRepo.remove(cart);
        return true;
    }
}
