import {createStore, createTypedHooks, action, Action, thunk, Thunk} from "easy-peasy";
import {AccountAndPerson, LoginRequest} from "./data/account";
import {logIn, logOut} from "./api/account";
import {StrainRecord, StrainTypeRecord} from "./data/strain";
import {getStrains, getStrainTypes} from "./api/strain";

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
}

export const store = createStore<StoreModel>({
    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        state.currentUser = payload;
    }),
    logIn: thunk(async (actions, payload) => {
        const accountAndPerson = await logIn(payload);
        actions.setCurrentUser(accountAndPerson);
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
    })
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
