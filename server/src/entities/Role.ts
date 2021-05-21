import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import Joi from "joi";

@Entity({name: "role"})
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false, default: 0})
    clearance: number;
}

export interface NewRoleRequest {
    name: string;
    clearance: number;
}

export const roleSchema = Joi.object().options({abortEarly: false}).keys({
    name: Joi.string().required(),
    clearance: Joi.number().integer().required()
});
