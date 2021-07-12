import { StoreModel } from "./_store";
import {
    AccountAndPerson,
    LoginRequest,
} from "../../../shared/resource_models/account";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { AccountClient } from "../clients/AccountClient";
import { LocalStorage } from "../utils/localStorage";

export interface UserStoreModel {
    currentUser: AccountAndPerson | undefined;
    setCurrentUser: Action<StoreModel, AccountAndPerson | undefined>;
    logIn: Thunk<StoreModel, LoginRequest>;
    logOut: Thunk<StoreModel, string>;
    tokenLogin: Thunk<StoreModel>;
}

export const userStore: UserStoreModel = {
    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        state.currentUser = payload;
    }),
    logIn: thunk(async (actions, payload) => {
        const accountAndPerson = await AccountClient.logIn(payload);
        actions.setCurrentUser(accountAndPerson);
        LocalStorage.saveToken(accountAndPerson.account.token!);
        actions.addSuccessAlert("Logged in successfully.");
    }),
    logOut: thunk(async (actions, token) => {
        try {
            await AccountClient.logOut(token);
            actions.setCurrentUser(undefined);
            LocalStorage.removeToken();
            actions.addSuccessAlert("Logged out successfully.");
        } catch (error) {
            actions.setCurrentUser(undefined);
            console.error(error);
        }
    }),
    tokenLogin: thunk(async actions => {
        const token = LocalStorage.getToken();
        if (token) {
            try {
                const accountAndPerson = await AccountClient.tokenLogin(token);
                actions.setCurrentUser(accountAndPerson);
                console.log("Logged in with token.");
            } catch (error) {
                console.error(error.response);
                console.error(error);
                actions.setCurrentUser(undefined);
            }
        }
    }),
};
