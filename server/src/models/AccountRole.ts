import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";

@Entity({ name: "account_role" })
export class AccountRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    accountId: number;

    @Column({ nullable: false })
    roleId: number;
}

export const applyRoleSchema = Joi.object()
    .options({ abortEarly: false })
    .keys({
        accountId: Joi.number().integer().required(),
        roleId: Joi.number().integer().required(),
    });
