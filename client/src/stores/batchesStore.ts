import { BatchRecord } from "../../../shared/resource_models/batch";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { getBatches } from "../api/batch";
import { StoreModel } from "./_store";

export interface BatchesStoreModel {
    batches: BatchRecord[] | undefined;
    setBatches: Action<StoreModel, BatchRecord[]>;
    fetchBatches: Thunk<StoreModel>;
}

export const batchesStore: BatchesStoreModel = {
    batches: undefined,
    setBatches: action((state, payload) => {
        state.batches = payload;
    }),
    fetchBatches: thunk(async actions => {
        const batches = await getBatches();
        actions.setBatches(batches);
    }),
};
