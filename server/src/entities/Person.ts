import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "person"})
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;


    @Column({nullable: false})
    phone: string;
}

export interface PersonRequest {
    firstName: string;
    lastName: string;
    phone: string;
}
