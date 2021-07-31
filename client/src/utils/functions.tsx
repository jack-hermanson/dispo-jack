import { AxiosError } from "axios";
import React from "react";
import { CartBatchRecord } from "../../../shared/resource_models/cartBatch";
import { StrainRecord } from "../../../shared/resource_models/strain";

export function handleCheckChange<T>(
    event: React.ChangeEvent<HTMLInputElement>,
    existingData: T[],
    newItem: T
): T[] {
    const checked = event.target.checked;
    const alreadyInList = existingData.some(s => s === newItem);
    let newSelectedItems: T[] = [];

    if (checked && !alreadyInList) {
        newSelectedItems = [...existingData, newItem];
    } else if (!checked && alreadyInList) {
        newSelectedItems = existingData.filter(n => n !== newItem);
    }

    return newSelectedItems;
}

export function handleResponseError(error: AxiosError): string {
    let text;
    if (error.response) {
        if (error.response.status === 409) {
            const conflicts = error.response.data.conflictingProperties;
            text = `A record already exists with the same ${conflicts}.`;
        } else {
            text = error.response.data;
        }
    } else {
        text = error.message;
    }
    console.error(error);
    return text;
}

export const getCartBatchPrice = (
    cartBatch: CartBatchRecord,
    strain: StrainRecord
): number => {
    switch (cartBatch.amount) {
        case 1:
            return strain.gramPrice;
        case 3.5:
            return strain.gramPrice;
        case 7:
            return strain.quadPrice;
        case 28:
            return strain.ouncePrice;
        default:
            throw new Error("Unrecognized cartBatch amount");
    }
};
