import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";
import { idColumn } from "jack-hermanson-ts-utils";

export class CartSales1627659293951 implements MigrationInterface {
    // cart table
    cart = new Table({
        name: "cart",
        columns: [
            idColumn,
            {
                name: "employeeId",
                type: "integer",
                isNullable: true,
            },
            {
                name: "personId",
                type: "integer",
                isNullable: true,
            },
            {
                name: "lastUpdated",
                type: "timestamp",
                isNullable: false,
                default: "CURRENT_TIMESTAMP",
            },
        ],
    });

    // cart foreign keys
    cartForeignKeys: TableForeignKey[] = [
        new TableForeignKey({
            columnNames: ["employeeId"],
            referencedTableName: "person",
            referencedColumnNames: ["id"],
        }),
        new TableForeignKey({
            columnNames: ["personId"],
            referencedTableName: "person",
            referencedColumnNames: ["id"],
        }),
    ];

    // cart batch table
    cartBatch = new Table({
        name: "cart_batch",
        columns: [
            idColumn,
            {
                name: "cartId",
                type: "integer",
                isNullable: false,
            },
            {
                name: "batchId",
                type: "integer",
                isNullable: false,
            },
            {
                name: "amount",
                type: "float",
                isNullable: false,
            },
        ],
    });

    // cart batch foreign keys
    cartBatchForeignKeys: TableForeignKey[] = [
        new TableForeignKey({
            columnNames: ["cartId"],
            referencedTableName: "cart",
            referencedColumnNames: ["id"],
        }),
        new TableForeignKey({
            columnNames: ["batchId"],
            referencedTableName: "batch",
            referencedColumnNames: ["id"],
        }),
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.cart);
        await queryRunner.createForeignKeys(this.cart, this.cartForeignKeys);

        await queryRunner.createTable(this.cartBatch);
        await queryRunner.createForeignKeys(
            this.cartBatch,
            this.cartBatchForeignKeys
        );

        await queryRunner.addColumn(
            "adjustment",
            new TableColumn({
                name: "notes",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("adjustment", "notes");
        await queryRunner.dropForeignKeys(
            this.cartBatch,
            this.cartBatchForeignKeys
        );
        await queryRunner.dropTable(this.cartBatch);
        await queryRunner.dropForeignKeys(this.cart, this.cartForeignKeys);
        await queryRunner.dropTable(this.cart);
    }
}
