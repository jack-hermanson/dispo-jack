import { StrainTypeRecord } from "../../../shared/resource_models/strainType";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { StrainClient } from "../clients/StrainClient";
import { StoreModel } from "./_store";

export interface StrainTypesStoreModel {
    strainTypes: StrainTypeRecord[] | undefined;
    setStrainTypes: Action<StoreModel, StrainTypeRecord[]>;
    fetchStrainTypes: Thunk<StoreModel>;
}

export const strainTypesStore: StrainTypesStoreModel = {
    strainTypes: undefined,
    setStrainTypes: action((state, payload) => {
        state.strainTypes = payload;
    }),
    fetchStrainTypes: thunk(async actions => {
        const strainTypes = await StrainClient.getStrainTypes();
        actions.setStrainTypes(strainTypes);
    }),
};
