import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CartAdjustment1627780783655 implements MigrationInterface {
    cartIdForeignKey = new TableForeignKey({
        referencedColumnNames: ["id"],
        referencedTableName: "cart",
        columnNames: ["cartId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "adjustment",
            "purchaseId",
            new TableColumn({
                name: "purchaseId",
                type: "integer",
                isNullable: true,
            })
        );
        await queryRunner.addColumn(
            "adjustment",
            new TableColumn({
                name: "cartId",
                type: "integer",
                isNullable: true,
            })
        );
        await queryRunner.createForeignKeys("adjustment", [
            this.cartIdForeignKey,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "adjustment",
            "purchaseId",
            new TableColumn({
                name: "purchaseId",
                type: "integer",
                isNullable: false,
            })
        );
        await queryRunner.dropForeignKey("adjustment", this.cartIdForeignKey);
        await queryRunner.dropColumn("adjustment", "cartId");
    }
}
