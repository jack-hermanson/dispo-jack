import { ResourceModel } from "./_base";

export interface StrainTypeRequest {
    name: string;
}

export interface StrainTypeRecord extends StrainTypeRequest, ResourceModel {}
