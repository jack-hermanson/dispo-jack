import {createStore, createTypedHooks, action, Action, thunk, Thunk, computed, Computed} from "easy-peasy";
import {AccountAndPerson, LoginRequest} from "./data/account";
import {logIn, logOut} from "./api/account";
import {StrainAndBatch, StrainRecord, StrainRequest, StrainTypeRecord} from "./data/strain";
import {addStrain, getStrains, getStrainTypes} from "./api/strain";
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
    addStrain: Thunk<StoreModel, { strain: StrainRequest; token: string; }>;

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
        actions.addAlert({text: "Logged in successfully.", color: "info", error: false});
    }),
    logOut: thunk(async (actions, token) => {
        await logOut(token);
        actions.setCurrentUser(undefined);
        actions.addAlert({text: "Logged out successfully.", color: "info", error: false});
    }),

    strains: undefined,
    setStrains: action((state, payload) => {
        state.strains = payload;
    }),
    fetchStrains: thunk(async (actions) => {
        const strains = await getStrains();
        actions.setStrains(strains);
    }),
    addStrain: thunk(async (actions, payload) => {
        try {
            await addStrain(payload.strain, payload.token);
            await actions.fetchStrains();
        } catch (error) {
            if (error.response.status === 409) {
                const conflicts = error.response.data.conflictingProperties;
                actions.addAlert({
                    color: "danger",
                    text: `A record already exists with the same ${conflicts}.`,
                    error: true
                });
                throw error;
            }
        }
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
