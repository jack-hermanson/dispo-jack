import axios from "axios";
import {
    CartBatchRequest,
    CartBatchRecord,
} from "../../../shared/resource_models/cartBatch";

const baseUrl = "/api/cart-batches/";

export abstract class CartBatchClient {
    static async create(cartBatchRequest: CartBatchRequest) {
        const response = await axios.post<CartBatchRecord>(
            baseUrl,
            cartBatchRequest
        );
        return response.data;
    }

    static async getCartBatches(cartId: number) {
        const response = await axios.get<CartBatchRecord[]>(
            `${baseUrl}/cart/${cartId}`
        );
        return response.data;
    }
}
