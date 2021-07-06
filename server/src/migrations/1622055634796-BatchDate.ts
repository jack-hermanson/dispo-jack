import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class BatchDate1622055634796 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "batch",
            new TableColumn({
                name: "dateReceived",
                type: "timestamp",
                isNullable: false,
                default: "CURRENT_TIMESTAMP",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("batch", "dateReceived");
    }
}
