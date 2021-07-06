import { BatchRecord } from "../../../shared/resource_models/batch";
import axios from "axios";

const baseUrl = "/api/batches";

export const getBatches = async (): Promise<BatchRecord[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
};
