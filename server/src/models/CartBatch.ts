import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";

@Entity()
export class CartBatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer", nullable: false })
    cartId: number;

    @Column({ type: "integer", nullable: false })
    batchId: number;

    @Column({ type: "float", nullable: false })
    amount: number;
}

export const cartBatchSchema = Joi.object()
    .options({ abortEarly: false })
    .keys({
        cartId: Joi.number().integer().positive().required(),
        batchId: Joi.number().integer().positive().required(),
        amount: Joi.number().positive().required(),
    });
