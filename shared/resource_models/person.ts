import { ResourceModel } from "./_base";

export interface PersonRequest {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface PersonRecord extends ResourceModel, PersonRequest {}
