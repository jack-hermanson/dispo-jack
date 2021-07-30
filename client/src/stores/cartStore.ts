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
    cartBatches: CartBatchRecord[] | undefined;
}

export const cartStore: CartStoreModel = {
    cart: undefined,
    cartBatches: undefined,
};
