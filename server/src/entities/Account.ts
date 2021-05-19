import {OneToOne, ManyToMany, JoinTable, Column, Entity, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {Person} from "./Person";
import {Role} from "./Role";

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    username: string;

    @Column({nullable: true})
    email?: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: true})
    token: string;

    @OneToOne(() => Person, person => person.account,
        {cascade: true})
    @JoinColumn({name: "personId"})
    person: Person;

    @ManyToMany(() => Role)
    @JoinTable({
        name: "account_role"
    })
    roles: Role[];
}

export interface AccountRequest {
    username: string;
    password: string;
    email?: string;
    personId: number;
}
