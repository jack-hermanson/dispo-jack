import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class imageUrl1622052796655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("batch", new TableColumn({
            name: "imageUrl",
            type: "varchar",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("batch", "imageUrl");
    }

}
