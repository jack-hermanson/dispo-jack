import {BaseModel} from "./_baseModel";

export interface PersonRequest {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface PersonRecord extends BaseModel, PersonRequest {}
