import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "strain_type"})
export class StrainType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;
}
