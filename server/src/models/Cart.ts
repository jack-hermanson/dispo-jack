import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer", nullable: true })
    employeeId?: number;

    @Column({ type: "integer", nullable: true })
    personId?: number; // customer

    @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
    lastUpdated: Date;
}

export const cartSchema = Joi.object().options({ abortEarly: false }).keys({
    employeeId: Joi.number().integer().optional(),
    personId: Joi.number().integer().optional(),
});
