import { CartRecord, CartRequest } from "../../../shared/resource_models/cart";
import {
    CartBatchRecord,
    CartBatchRequest,
} from "../../../shared/resource_models/cartBatch";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { StoreModel } from "./_store";
import { CartClient } from "../clients/CartClient";
import { CartBatchClient } from "../clients/CartBatchClient";

export interface CartStoreModel {
    cart: CartRecord | undefined;
    setCart: Action<StoreModel, CartRecord | undefined>;
    createCart: Thunk<StoreModel, CartRequest>;
    cartBatches: CartBatchRecord[] | undefined;
    setCartBatches: Action<StoreModel, CartBatchRecord[] | undefined>;
    addCartBatch: Action<StoreModel, CartBatchRecord>;
    createCartBatch: Thunk<StoreModel, CartBatchRequest>;
}

export const cartStore: CartStoreModel = {
    cart: undefined,
    setCart: action((state, payload) => {
        state.cart = payload;
    }),
    createCart: thunk(async (actions, payload) => {
        try {
            const cart = await CartClient.create(payload);
            actions.setCart(cart);
        } catch (error) {
            actions.addError(error.message);
            console.error(error.response);
            throw error;
        }
    }),
    cartBatches: undefined,
    setCartBatches: action((state, payload) => {
        state.cartBatches = payload;
    }),
    addCartBatch: action((state, payload) => {
        if (state.cartBatches) {
            state.cartBatches = [...state.cartBatches, payload];
        } else {
            state.cartBatches = [payload];
        }
    }),
    createCartBatch: thunk(async (actions, payload) => {
        try {
            const cartBatch = await CartBatchClient.create(payload);
            actions.addCartBatch(cartBatch);
        } catch (error) {
            console.error(error.response);
            actions.addError(error.message);
            throw error;
        }
    }),
};
