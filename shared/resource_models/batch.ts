import { ResourceModel } from "jack-hermanson-ts-utils";
import { formatPercent, KeyValPair } from "jack-hermanson-ts-utils";

export interface BatchRequest {
    strainId: number;
    size: number;
    thcPotency: number;
    cbdPotency: number;
    notes?: string;
    imageUrl?: string;
    dateReceived: Date;
}

export interface BatchRecord extends BatchRequest, ResourceModel {}

export const getPotencyKeyVals = (batch: BatchRecord): KeyValPair[] => {
    return [
        { key: "THC", val: formatPercent(batch.thcPotency) },
        { key: "CBD", val: formatPercent(batch.cbdPotency) },
    ];
};
