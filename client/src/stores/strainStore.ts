import {
    StrainAndBatch,
    StrainRecord,
    StrainRequest,
} from "../../../shared/resource_models/strain";
import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { StoreModel } from "./_store";
import { addStrain, editStrain, getStrains } from "../clients/strain";
import { handleResponseError } from "../utils/functions";

export interface StrainStoreModel {
    strains: StrainRecord[] | undefined;
    setStrains: Action<StoreModel, StrainRecord[]>;
    fetchStrains: Thunk<StoreModel>;
    addStrain: Thunk<StoreModel, { strain: StrainRequest; token: string }>;
    editStrain: Thunk<
        StoreModel,
        { strainId: number; strain: StrainRequest; token: string }
    >;
    strainsInStock: Computed<StoreModel, StrainAndBatch[] | undefined>;
}

export const strainStore: StrainStoreModel = {
    strains: undefined,
    setStrains: action((state, payload) => {
        state.strains = payload;
    }),
    fetchStrains: thunk(async actions => {
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
            const newStrain = await editStrain(
                payload.strainId,
                payload.strain,
                payload.token
            );
            console.log({ newStrain });
            await actions.fetchStrains();
            actions.addSuccessAlert(
                `Strain "${newStrain.name}" edited successfully.`
            );
        } catch (error) {
            actions.addError(handleResponseError(error));
            throw error;
        }
    }),
    strainsInStock: computed(state => {
        if (state.strains && state.batches) {
            const strainsAndBatches: StrainAndBatch[] = [];

            for (let batch of state.batches) {
                const strain = state.strains.find(s => s.id === batch.strainId);
                strainsAndBatches.push({
                    strain: strain!,
                    batch: batch,
                });
            }

            return strainsAndBatches;
        }

        return undefined;
    }),
};
