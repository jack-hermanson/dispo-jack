import {BaseModel} from "./_baseModel";

export interface BatchRequest {
    strainId: number;
    size: number;
    thcPotency: number;
    cbdPotency: number;
    notes?: string;
    imageUrl?: string;
}

export interface BatchRecord extends BatchRequest, BaseModel {}
