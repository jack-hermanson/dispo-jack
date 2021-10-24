import { ResourceModel } from "jack-hermanson-ts-utils";

export interface PersonRequest {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface PersonRecord extends ResourceModel, PersonRequest {}
