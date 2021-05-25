import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "strain"})
export class Strain {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false, type: "integer"})
    strainTypeId: number;

    @Column({nullable: false, type: "float"})
    ouncePrice: number;

    @Column({nullable: false, type: "float"})
    quadPrice: number;

    @Column({nullable: false, type: "float"})
    eighthPrice: number;

    @Column({nullable: false, type: "float"})
    gramPrice: number;
}
