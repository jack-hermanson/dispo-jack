import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "account_person"})
export class AccountPerson {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    accountId: number;

    @Column({unique: true, nullable: false})
    personId: number;
}
