import { ResourceModel } from "./_base";

export interface CartRequest {
    employeeId?: number;
    personId?: number;
}

export interface CartRecord extends CartRequest {
    lastUpdated: Date;
}
