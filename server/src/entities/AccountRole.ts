import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "account_role"})
export class AccountRole {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    accountId: number;

    @Column({nullable: false})
    roleId: number;
}
