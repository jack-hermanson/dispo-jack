import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "batch"})
export class Batch {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: "integer"})
    strainId: number;

    @Column({type: "float", nullable: false})
    size: number;

    @Column({type: "float", nullable: false})
    thcPotency: number;

    @Column({type: "float", nullable: false})
    cbdPotency: number;

    @Column()
    notes?: string;
}
