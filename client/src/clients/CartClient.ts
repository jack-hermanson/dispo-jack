import axios from "axios";
import { CartRecord, CartRequest } from "../../../shared/resource_models/cart";

const baseUrl = "/api/carts";

export abstract class CartClient {
    static async create(cartRequest: CartRequest) {
        const response = await axios.post<CartRecord>(baseUrl, cartRequest);
        return response.data;
    }
}
