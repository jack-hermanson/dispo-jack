import {
    BatchRecord,
    BatchRequest,
} from "../../../shared/resource_models/batch";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { BatchClient } from "../clients/BatchClient";
import { StoreModel } from "./_store";

export interface BatchStoreModel {
    batches: BatchRecord[] | undefined;
    setBatches: Action<StoreModel, BatchRecord[]>;
    fetchBatches: Thunk<StoreModel>;
    saveBatch: Thunk<StoreModel, { batchRequest: BatchRequest; token: string }>;
}

export const batchStore: BatchStoreModel = {
    batches: undefined,
    setBatches: action((state, payload) => {
        state.batches = payload;
    }),
    fetchBatches: thunk(async actions => {
        const batches = await BatchClient.getBatches();
        actions.setBatches(batches);
    }),
    saveBatch: thunk(async (actions, payload) => {
        try {
            await BatchClient.addBatch(payload.batchRequest, payload.token);
            actions.addSuccessAlert("Successfully added new batch.");
        } catch (error) {
            console.error(error.response);
            actions.addError(error.message);
            throw error;
        }
    }),
};
