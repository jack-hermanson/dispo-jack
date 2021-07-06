import {
    createStore,
    createTypedHooks,
    action,
    Action,
    thunk,
    Thunk,
    computed,
    Computed,
} from "easy-peasy";
import { StrainAndBatch } from "../../../shared/resource_models/strain";
import { BatchRecord } from "../../../shared/resource_models/batch";
import { getBatches } from "../api/batch";
import { AlertType } from "../utils/types";
import { userStore, UserStoreModel } from "./userStore";
import { strainStore, StrainStoreModel } from "./strainStore";
import { strainTypesStore, StrainTypesStoreModel } from "./strainTypesStore";
import { batchesStore, BatchesStoreModel } from "./batchesStore";

export interface StoreModel
    extends UserStoreModel,
        StrainStoreModel,
        StrainTypesStoreModel,
        BatchesStoreModel {
    strainsInStock: Computed<StoreModel, StrainAndBatch[] | undefined>;

    alerts: AlertType[];
    setAlerts: Action<StoreModel, AlertType[]>;
    addAlert: Action<StoreModel, AlertType>;
    addError: Action<StoreModel, string>;
    addSuccessAlert: Action<StoreModel, string>;
}

export const _store = createStore<StoreModel>({
    ...userStore,
    ...strainStore,
    ...strainTypesStore,
    ...batchesStore,

    strainsInStock: computed(state => {
        if (state.strains && state.batches) {
            const strainsAndBatches: StrainAndBatch[] = [];

            for (let batch of state.batches) {
                const strain = state.strains.find(s => s.id === batch.strainId);
                strainsAndBatches.push({
                    strain: strain!,
                    batch: batch,
                });
            }

            return strainsAndBatches;
        }

        return undefined;
    }),

    alerts: [],
    setAlerts: action((state, payload) => {
        state.alerts = payload;
    }),
    addAlert: action((state, payload) => {
        state.alerts = [payload, ...state.alerts];
    }),
    addError: action((state, payload) => {
        state.alerts = [
            {
                error: true,
                text: payload,
                color: "danger",
            },
            ...state.alerts,
        ];
    }),
    addSuccessAlert: action((state, payload) => {
        state.alerts = [
            {
                error: false,
                text: payload,
                color: "info",
            },
            ...state.alerts,
        ];
    }),
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
