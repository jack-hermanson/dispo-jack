import { getConnection, Repository } from "typeorm";
import { Response } from "express";
import { CartBatch } from "../models/CartBatch";
import { HTTP } from "jack-hermanson-ts-utils";
import { PersonService } from "./PersonService";
import { CartService } from "./CartService";

const getRepos = (): {
    cartBatchRepo: Repository<CartBatch>;
} => {
    const connection = getConnection();
    const cartBatchRepo = connection.getRepository(CartBatch);
    return { cartBatchRepo };
};

export abstract class CartBatchService {
    static async getOne(
        cartBatchId: number,
        res: Response
    ): Promise<CartBatch | undefined> {
        const { cartBatchRepo } = getRepos();

        const cartBatch = await cartBatchRepo.findOne(cartBatchId);
        if (!cartBatch) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return cartBatch;
    }

    static async getCartBatches(
        cartId: number,
        res: Response
    ): Promise<CartBatch[] | undefined> {
        const { cartBatchRepo } = getRepos();

        // is cartId legit?
        const cart = await CartService.getOne(cartId, res);
        if (!cart) return undefined;

        return await cartBatchRepo.find({ cartId });
    }

    static async delete(
        cartBatchId: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { cartBatchRepo } = getRepos();

        const cartBatch = await this.getOne(cartBatchId, res);
        if (!cartBatch) return undefined;

        await cartBatchRepo.remove(cartBatch);
        return true;
    }
}
