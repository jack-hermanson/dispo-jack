import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import Joi from "joi";

@Entity({name: "strain_type"})
export class StrainType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;
}

export interface StrainTypeRequest {
    name: string;
}

export const strainTypeSchema = Joi.object().options({abortEarly: false}).keys({
    name: Joi.string().required(),
});
