import { BatchRecord } from "../../../shared/resource_models/batch";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { BatchClient } from "../clients/BatchClient";
import { StoreModel } from "./_store";

export interface BatchStoreModel {
    batches: BatchRecord[] | undefined;
    setBatches: Action<StoreModel, BatchRecord[]>;
    fetchBatches: Thunk<StoreModel>;
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
};
