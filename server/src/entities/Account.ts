import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import Joi from "joi";
import {PersonRequest} from "./Person";


@Entity({name: "account"})
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    username: string;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: true})
    token?: string;

}

export interface EditAccountRequest {
    username: string;
    email: string;
    personId: number;
}

export interface NewAccountRequest extends EditAccountRequest {
    password: string;
}

export interface RegisterRequest extends Omit<NewAccountRequest, "personId">, PersonRequest {}

export const baseSchema = Joi.object().options({abortEarly: false}).keys({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    personId: Joi.number().integer().required(),
    roleId: Joi.number().integer().optional()
});

export const newAccountSchema = baseSchema.keys({
    password: Joi.string().min(3).required()
});

export const registerSchema = Joi.object().options({abortEarly: false}).keys({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phone: Joi.string().required()
});
