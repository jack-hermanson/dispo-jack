import { BatchRecord } from "../../../shared/resource_models/batch";
import axios from "axios";

const baseUrl = "/clients/batches";

export abstract class BatchClient {
    static async getBatches() {
        const response = await axios.get<BatchRecord[]>(baseUrl);
        return response.data;
    }
}
