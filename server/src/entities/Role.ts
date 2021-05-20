import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "role"})
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false, default: 0})
    clearance: number;
}
