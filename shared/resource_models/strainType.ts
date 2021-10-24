import { ResourceModel } from "jack-hermanson-ts-utils";

export interface StrainTypeRequest {
    name: string;
}

export interface StrainTypeRecord extends StrainTypeRequest, ResourceModel {}
