import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import Joi from "joi";

@Entity({name: "batch"})
export class Batch {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: "integer"})
    strainId: number;

    @Column({type: "float", nullable: false})
    size: number;

    @Column({type: "float", nullable: false})
    thcPotency: number;

    @Column({type: "float", nullable: false})
    cbdPotency: number;

    @Column()
    notes?: string;

    @Column()
    imageUrl?: string;

    @Column({type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP"})
    dateReceived: Date;
}

export interface BatchRequest {
    strainId: number;
    size: number;
    thcPotency: number;
    cbdPotency: number;
    notes?: string;
    imageUrl?: string;
    date: Date;
}

export const batchSchema = Joi.object().options({abortEarly: false}).keys({
    strainId: Joi.number().integer().required(),
    size: Joi.number().required(),
    thcPotency: Joi.number().required(),
    cbdPotency: Joi.number().required(),
    notes: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional()
});
