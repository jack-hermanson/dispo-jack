import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";

@Entity({ name: "strain" })
export class Strain {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, type: "integer" })
    strainTypeId: number;

    @Column({ nullable: false, type: "float" })
    ouncePrice: number;

    @Column({ nullable: false, type: "float" })
    quadPrice: number;

    @Column({ nullable: false, type: "float" })
    eighthPrice: number;

    @Column({ nullable: false, type: "float" })
    gramPrice: number;
}

export const strainSchema = Joi.object().options({ abortEarly: false }).keys({
    name: Joi.string().required(),
    strainTypeId: Joi.number().integer().required(),
    ouncePrice: Joi.number().required(),
    quadPrice: Joi.number().required(),
    eighthPrice: Joi.number().required(),
    gramPrice: Joi.number().required(),
});
