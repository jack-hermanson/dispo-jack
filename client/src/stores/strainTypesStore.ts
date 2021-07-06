import { StrainTypeRecord } from "../../../shared/resource_models/strainType";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { getStrainTypes } from "../api/strain";
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
        const strainTypes = await getStrainTypes();
        actions.setStrainTypes(strainTypes);
    }),
};
