import {BaseModel} from "./_baseModel";
import {BatchRecord} from "./batch";
import {KeyValPair} from "../utils/types";
import {formatMoney} from "../utils/functions";

export interface StrainRequest {
    name: string;
    strainTypeId: number;
    ouncePrice: number;
    quadPrice: number;
    eighthPrice: number;
    gramPrice: number;
}

export interface StrainRecord extends BaseModel, StrainRequest {
}

export interface StrainTypeRequest {
    name: string;
}

export interface StrainTypeRecord extends BaseModel, StrainTypeRequest {
}

export interface StrainAndBatch {
    strain: StrainRecord;
    batch: BatchRecord;
}

export const getPriceKeyVal = (key: string, price: number): KeyValPair => {
    return {
        key: key,
        val: formatMoney(price)
    };
}

export const getPriceKeyVals = (strain: StrainRequest): KeyValPair[] => {
    return [
        {key: "Ounce (28g) Price", val: formatMoney(strain.ouncePrice)},
        {key: "Quad (7g) Price", val: formatMoney(strain.quadPrice)},
        {key: "Eighth (3.5g) Price", val: formatMoney(strain.eighthPrice)},
        {key: "Gram (1g) Price", val: formatMoney(strain.gramPrice)}
    ];
};
