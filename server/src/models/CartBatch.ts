import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CartBatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer", nullable: false })
    cardId: number;

    @Column({ type: "integer", nullable: false })
    batchId: number;

    @Column({ type: "float", nullable: false })
    amount: number;
}
