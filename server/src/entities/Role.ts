import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false, default: 0})
    clearance: number;
}
