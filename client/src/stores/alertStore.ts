import { AlertType } from "../utils/types";
import { action, Action } from "easy-peasy";
import { StoreModel } from "./_store";

export interface AlertStoreModel {
    alerts: AlertType[];
    setAlerts: Action<StoreModel, AlertType[]>;
    addAlert: Action<StoreModel, AlertType>;
    addError: Action<StoreModel, string>;
    addSuccessAlert: Action<StoreModel, string>;
}

export const alertStore: AlertStoreModel = {
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
};
