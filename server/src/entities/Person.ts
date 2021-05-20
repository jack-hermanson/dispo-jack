import {OneToOne, Column, Entity, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {Account} from "./Account";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @OneToOne(() => Account, account => account.person,
        {nullable: true, orphanedRowAction: "nullify"})
    readonly account: Account;
}

export interface PersonRequest {
    firstName: string;
    lastName: string;
}
