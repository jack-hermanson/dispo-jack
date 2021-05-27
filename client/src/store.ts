import {createStore, createTypedHooks, action, Action, thunk, Thunk, computed, Computed} from "easy-peasy";
import {AccountAndPerson, LoginRequest} from "./data/account";
import {logIn, logOut} from "./api/account";
import {StrainAndBatch, StrainRecord, StrainTypeRecord} from "./data/strain";
import {getStrains, getStrainTypes} from "./api/strain";
import {BatchRecord} from "./data/batch";
import {getBatches} from "./api/batch";
import {AlertType} from "./utils/types";

interface StoreModel {
    currentUser: AccountAndPerson | undefined;
    setCurrentUser: Action<StoreModel, AccountAndPerson | undefined>;
    logIn: Thunk<StoreModel, LoginRequest>;
    logOut: Thunk<StoreModel, string>;

    strains: StrainRecord[] | undefined;
    setStrains: Action<StoreModel, StrainRecord[]>;
    fetchStrains: Thunk<StoreModel>;

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
}

export const store = createStore<StoreModel>({
    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        state.currentUser = payload;
    }),
    logIn: thunk(async (actions, payload) => {
        const accountAndPerson = await logIn(payload);
        actions.setCurrentUser(accountAndPerson);
        actions.addAlert({text: "Logged in successfully.", color: "info"});
    }),
    logOut: thunk(async (actions, token) => {
        await logOut(token);
        actions.setCurrentUser(undefined);
    }),

    strains: undefined,
    setStrains: action((state, payload) => {
        state.strains = payload;
    }),
    fetchStrains: thunk(async (actions) => {
        const strains = await getStrains();
        actions.setStrains(strains);
    }),

    strainTypes: undefined,
    setStrainTypes: action((state, payload) => {
        state.strainTypes = payload;
    }),
    fetchStrainTypes: thunk(async (actions) => {
        const strainTypes = await getStrainTypes();
        actions.setStrainTypes(strainTypes);
    }),

    batches: undefined,
    setBatches: action((state, payload) => {
        state.batches = payload;
    }),
    fetchBatches: thunk(async (actions) => {
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
                    batch: batch
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
    })
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
