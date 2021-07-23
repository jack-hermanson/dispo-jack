import { StoreModel } from "./_store";
import { RegisterRequest } from "../../../shared/resource_models/account";
import { thunk, Thunk } from "easy-peasy";
import { AccountClient } from "../clients/AccountClient";

export interface AccountStoreModel {
    register: Thunk<StoreModel, RegisterRequest>;
}

export const accountStore: AccountStoreModel = {
    register: thunk(async (actions, payload) => {
        try {
            await AccountClient.register(payload);
            actions.addSuccessAlert("Registered successfully. Please log in.");
        } catch (error) {
            let message: string;
            console.error(error.response);
            switch (error.response.status) {
                case 400:
                    message = `Bad request: ${error.response.data.toString()}`;
                    break;
                case 409:
                    const props: Array<string> =
                        error.response.data.conflictingProperties;
                    message = `The ${props.join(", ")} you entered ${
                        props.length === 1 ? "is" : "are"
                    } not available.`;
                    break;
                default:
                    message = error.message;
                    break;
            }
            actions.addError(message);
            throw error;
        }
    }),
};
