import { BatchRecord } from "../../../shared/resource_models/batch";
import axios from "axios";

const baseUrl = "/clients/batches";

export const getBatches = async (): Promise<BatchRecord[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
};
