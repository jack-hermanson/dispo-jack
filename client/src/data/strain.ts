import {BaseModel} from "./_baseModel";

export interface StrainRequest {
    name: string;
    strainTypeId: number;
    ouncePrice: number;
    quadPrice: number;
    eighthPrice: number;
    gramPrice: number;
}

export interface StrainRecord extends BaseModel, StrainRequest {}

export interface StrainTypeRequest {
    name: string;
}

export interface StrainTypeRecord extends BaseModel, StrainTypeRequest {}
