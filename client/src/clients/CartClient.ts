import axios from "axios";
import { CartRecord, CartRequest } from "../../../shared/resource_models/cart";
import { getAuthHeader } from "jack-hermanson-ts-utils";
import { CartBatchRecord } from "../../../shared/resource_models/cartBatch";

const baseUrl = "/api/carts";

export abstract class CartClient {
    static async create(cartRequest: CartRequest) {
        const response = await axios.post<CartRecord>(baseUrl, cartRequest);
        return response.data;
    }

    static async getCustomerCart(token: string) {
        const response = await axios.get<CartRecord | undefined>(
            `${baseUrl}/customer`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getEmployeeCart(token: string) {
        const response = await axios.get<CartRecord | undefined>(
            `${baseUrl}/employee`,
            getAuthHeader(token)
        );
        return response.data;
    }
}
