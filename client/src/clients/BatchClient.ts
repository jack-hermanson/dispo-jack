import {
    BatchRecord,
    BatchRequest,
} from "../../../shared/resource_models/batch";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";

const baseUrl = "/api/batches";

export abstract class BatchClient {
    static async getBatches() {
        const response = await axios.get<BatchRecord[]>(baseUrl);
        return response.data;
    }

    static async addBatch(batchRequest: BatchRequest, token: string) {
        if (!batchRequest.imageUrl?.length) {
            delete batchRequest.imageUrl;
        }
        if (!batchRequest.notes?.length) {
            delete batchRequest.notes;
        }
        const response = await axios.post<BatchRecord>(
            baseUrl,
            batchRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async deleteBatch(id: number, token: string) {
        const response = await axios.delete<boolean>(
            `${baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async updateBatch(
        id: number,
        batchRequest: BatchRequest,
        token: string
    ) {
        if (!batchRequest.imageUrl?.length) {
            delete batchRequest.imageUrl;
        }
        if (!batchRequest.notes?.length) {
            delete batchRequest.notes;
        }
        const response = await axios.put<BatchRecord>(
            `${baseUrl}/${id}`,
            batchRequest,
            getAuthHeader(token)
        );
        return response.data;
    }
}
