import {createStore, createTypedHooks, action, Action, thunk, Thunk, computed, Computed} from "easy-peasy";
import {AccountAndPerson, LoginRequest} from "./data/account";
import {logIn, logOut} from "./api/account";
import {StrainAndBatch, StrainRecord, StrainRequest, StrainTypeRecord} from "./data/strain";
import {addStrain, editStrain, getStrains, getStrainTypes} from "./api/strain";
import {BatchRecord} from "./data/batch";
import {getBatches} from "./api/batch";
import {AlertType} from "./utils/types";
import {handleResponseError} from "./utils/functions";

interface StoreModel {
    currentUser: AccountAndPerson | undefined;
    setCurrentUser: Action<StoreModel, AccountAndPerson | undefined>;
    logIn: Thunk<StoreModel, LoginRequest>;
    logOut: Thunk<StoreModel, string>;

    strains: StrainRecord[] | undefined;
    setStrains: Action<StoreModel, StrainRecord[]>;
    fetchStrains: Thunk<StoreModel>;
    addStrain: Thunk<StoreModel, { strain: StrainRequest; token: string; }>;
    editStrain: Thunk<StoreModel, { strainId: number; strain: StrainRequest, token: string;}>

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

export const store = createStore<StoreModel>({
    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        state.currentUser = payload;
    }),
    logIn: thunk(async (actions, payload) => {
        const accountAndPerson = await logIn(payload);
        actions.setCurrentUser(accountAndPerson);
        actions.addSuccessAlert("Logged in successfully.");
    }),
    logOut: thunk(async (actions, token) => {
        try {
            await logOut(token);
            actions.setCurrentUser(undefined);
            actions.addSuccessAlert("Logged out successfully.");
        } catch (error) {
            actions.setCurrentUser(undefined);
            console.error(error);
        }

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
            actions.addSuccessAlert("Strain added successfully.");
        } catch (error) {
            actions.addError(handleResponseError(error));
            throw error;
        }
    }),
    editStrain: thunk(async (actions, payload) => {
        try {
            const newStrain = await editStrain(payload.strainId, payload.strain, payload.token);
            console.log({newStrain});
            await actions.fetchStrains();
            actions.addSuccessAlert(`Strain "${newStrain.name}" edited successfully.`);
        } catch (error) {
            actions.addError(handleResponseError(error));
            throw error;
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
    }),
    addError: action((state, payload) => {
        state.alerts = [{
            error: true,
            text: payload,
            color: "danger"
        }, ...state.alerts];
    }),
    addSuccessAlert: action((state, payload) => {
        state.alerts = [{
            error: false,
            text: payload,
            color: "info"
        }, ...state.alerts];
    })
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
