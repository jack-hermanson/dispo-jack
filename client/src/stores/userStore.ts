import { StoreModel } from "./_store";
import {
    AccountAndPerson,
    LoginRequest,
} from "../../../shared/resource_models/account";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { logIn, logOut } from "../api/account";

export interface UserStoreModel {
    currentUser: AccountAndPerson | undefined;
    setCurrentUser: Action<StoreModel, AccountAndPerson | undefined>;
    logIn: Thunk<StoreModel, LoginRequest>;
    logOut: Thunk<StoreModel, string>;
}

export const userStore: UserStoreModel = {
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
};
