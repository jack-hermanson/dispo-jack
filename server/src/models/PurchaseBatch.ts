import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PurchaseBatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "float", nullable: false })
    amount: number;

    @Column({ type: "integer", nullable: false })
    purchaseId: number;

    @Column({ type: "integer", nullable: false })
    batchId: number;
}
