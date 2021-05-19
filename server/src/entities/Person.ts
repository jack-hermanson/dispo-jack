import {OneToOne, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Account} from "./Account";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @OneToOne(() => Account, account => account.person, {nullable: true})
    account: Account;
}
