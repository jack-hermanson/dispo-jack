import { getConnection, Repository } from "typeorm";
import { Response } from "express";
import { CartBatch } from "../models/CartBatch";
import { HTTP } from "jack-hermanson-ts-utils";
import { CartService } from "./CartService";
import { CartBatchRequest } from "../../../shared/resource_models/cartBatch";
import { BatchService } from "./BatchService";
import { Cart } from "../models/Cart";
import { Batch } from "../models/Batch";

const getRepos = (): {
    cartBatchRepo: Repository<CartBatch>;
    cartRepo: Repository<Cart>;
    batchRepo: Repository<Batch>;
} => {
    const connection = getConnection();
    const cartBatchRepo = connection.getRepository(CartBatch);
    const cartRepo = connection.getRepository(Cart);
    const batchRepo = connection.getRepository(Batch);
    return { cartBatchRepo, cartRepo, batchRepo };
};

export abstract class CartBatchService {
    static async create(
        cartBatchRequest: CartBatchRequest,
        res: Response
    ): Promise<CartBatch | undefined> {
        const { cartBatchRepo, cartRepo, batchRepo } = getRepos();

        // is the cartId legit?
        const cart = await CartService.getOne(cartBatchRequest.cartId, res);
        if (!cart) return undefined;

        // is the batchId legit?
        const batch = await BatchService.getOne(cartBatchRequest.batchId, res);
        if (!batch) return undefined;

        // is the amount available in stock?
        if (batch.size >= cartBatchRequest.amount) {
            const newSize = batch.size - cartBatchRequest.amount;
            await batchRepo.save({ ...batch, size: newSize });
        } else {
            res.status(HTTP.BAD_REQUEST).send(
                `CartBatch is ${cartBatchRequest.amount} grams, but only ${batch.size} grams are available in stock.`
            );
            return undefined;
        }

        // create record
        const cartBatch = await cartBatchRepo.save(cartBatchRequest);

        // update cart
        await cartRepo.save({ ...cart, lastUpdated: new Date() });

        return cartBatch;
    }

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
