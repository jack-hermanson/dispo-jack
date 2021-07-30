import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer", nullable: true })
    employeeId?: number;

    @Column({ type: "integer", nullable: true })
    personId?: number; // customer

    @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
    lastUpdated: Date;
}
