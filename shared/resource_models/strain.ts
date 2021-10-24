import { ResourceModel } from "jack-hermanson-ts-utils";
import { BatchRecord } from "./batch";
import { formatMoney, KeyValPair } from "jack-hermanson-ts-utils";

export interface StrainRequest {
    name: string;
    strainTypeId: number;
    ouncePrice: number;
    quadPrice: number;
    eighthPrice: number;
    gramPrice: number;
}

export interface StrainRecord extends ResourceModel, StrainRequest {}

export interface StrainAndBatch {
    strain: StrainRecord;
    batch: BatchRecord;
}

export const getPriceKeyVals = (strain: StrainRequest): KeyValPair[] => {
    return [
        { key: "Ounce (28g) Price", val: formatMoney(strain.ouncePrice) },
        { key: "Quad (7g) Price", val: formatMoney(strain.quadPrice) },
        { key: "Eighth (3.5g) Price", val: formatMoney(strain.eighthPrice) },
        { key: "Gram (1g) Price", val: formatMoney(strain.gramPrice) },
    ];
};
