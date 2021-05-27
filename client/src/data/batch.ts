import {BaseModel} from "./_baseModel";
import {KeyValPair} from "../utils/types";
import {formatPercent} from "../utils/functions";

export interface BatchRequest {
    strainId: number;
    size: number;
    thcPotency: number;
    cbdPotency: number;
    notes?: string;
    imageUrl?: string;
}

export interface BatchRecord extends BatchRequest, BaseModel {}

export const getPotencyKeyVals = (batch: BatchRecord): KeyValPair[] => {
    return [
        {key: "THC", val: formatPercent(batch.thcPotency)},
        {key: "CBD", val: formatPercent(batch.cbdPotency)}
    ];
};
