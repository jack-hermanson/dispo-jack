import { ResourceModel } from "./_base";

export interface CartBatchRequest {
    cartId: number;
    batchId: number;
    amount: number;
}

export interface CartBatchRecord extends CartBatchRequest, ResourceModel {}
