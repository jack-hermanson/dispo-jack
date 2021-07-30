import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "date",
        nullable: false,
        default: () => "CURRENT_TIMESTAMP",
    })
    dateAndTime: Date;

    @Column({ type: "integer", nullable: false })
    employeeId: number;

    @Column({ type: "integer", nullable: true })
    customerId?: number;

    @Column({ nullable: true })
    notes?: string;
}
