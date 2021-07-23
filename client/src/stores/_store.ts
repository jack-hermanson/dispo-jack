import { createStore, createTypedHooks } from "easy-peasy";
import { userStore, UserStoreModel } from "./userStore";
import { strainStore, StrainStoreModel } from "./strainStore";
import { strainTypesStore, StrainTypesStoreModel } from "./strainTypesStore";
import { batchStore, BatchStoreModel } from "./batchStore";
import { alertStore, AlertStoreModel } from "./alertStore";
import { accountStore, AccountStoreModel } from "./accountStore";

export interface StoreModel
    extends UserStoreModel,
        StrainStoreModel,
        StrainTypesStoreModel,
        BatchStoreModel,
        AlertStoreModel,
        AccountStoreModel {}

export const _store = createStore<StoreModel>({
    ...userStore,
    ...strainStore,
    ...strainTypesStore,
    ...batchStore,
    ...alertStore,
    ...accountStore,
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
