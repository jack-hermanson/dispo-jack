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
import {
    StrainAndBatch,
    StrainRecord,
    StrainRequest,
} from "../../../shared/resource_models/strain";
import { StrainTypeRecord } from "../../../shared/resource_models/strainType";
import {
    addStrain,
    editStrain,
    getStrains,
    getStrainTypes,
} from "../api/strain";
import { BatchRecord } from "../../../shared/resource_models/batch";
import { getBatches } from "../api/batch";
import { AlertType } from "../utils/types";
import { handleResponseError } from "../utils/functions";
import { userStore, UserStoreModel } from "./userStore";
import { strainStore, StrainStoreModel } from "./strainStore";

export interface StoreModel extends UserStoreModel, StrainStoreModel {
    strainTypes: StrainTypeRecord[] | undefined;
    setStrainTypes: Action<StoreModel, StrainTypeRecord[]>;
    fetchStrainTypes: Thunk<StoreModel>;

    batches: BatchRecord[] | undefined;
    setBatches: Action<StoreModel, BatchRecord[]>;
    fetchBatches: Thunk<StoreModel>;

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

    strainTypes: undefined,
    setStrainTypes: action((state, payload) => {
        state.strainTypes = payload;
    }),
    fetchStrainTypes: thunk(async actions => {
        const strainTypes = await getStrainTypes();
        actions.setStrainTypes(strainTypes);
    }),

    batches: undefined,
    setBatches: action((state, payload) => {
        state.batches = payload;
    }),
    fetchBatches: thunk(async actions => {
        const batches = await getBatches();
        actions.setBatches(batches);
    }),

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
