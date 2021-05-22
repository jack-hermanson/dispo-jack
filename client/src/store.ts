import {createStore, createTypedHooks, action, Action, thunk, Thunk} from "easy-peasy";
import {AccountAndPerson, LoginRequest} from "./data/account";
import {logIn, logOut} from "./api/account";

interface StoreModel {
    currentUser: AccountAndPerson | undefined;
    setCurrentUser: Action<StoreModel, AccountAndPerson | undefined>;
    logIn: Thunk<StoreModel, LoginRequest>;
    logOut: Thunk<StoreModel, string>;
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
    })
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
