import {OneToOne, ManyToMany, JoinTable, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Person} from "./Person";
import {Role} from "./Role";

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    username: string;

    @Column()
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: true})
    token: string;

    @OneToOne(() => Person, person => person.account)
    person: Person;

    @ManyToMany(() => Role)
    @JoinTable({
        name: "account_role"
    })
    roles: Role[];
}
