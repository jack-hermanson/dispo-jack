import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import {idColumn} from "../utils/constants";

export class Weed1621922119960 implements MigrationInterface {

    strainType = new Table({
        name: "strain_type",
        columns: [
            idColumn,
            {
                name: "name",
                type: "varchar",
                isNullable: false
            }
        ]
    });

    strain = new Table({
        name: "strain",
        columns: [
            idColumn,
            {
                name: "name",
                type: "varchar",
                isNullable: false
            },
            {
                name: "strainTypeId",
                type: "integer",
                isNullable: false
            },
            {
                name: "ouncePrice",
                type: "float"
            },
            {
                name: "quadPrice",
                type: "float"
            },
            {
                name: "eighthPrice",
                type: "float"
            },
            {
                name: "gramPrice",
                type: "float"
            }
        ]
    });

    batch = new Table({
        name: "batch",
        columns: [
            idColumn,
            {
                name: "strainId",
                type: "integer",
                isNullable: false
            },
            {
                name: "size",
                type: "float",
                isNullable: false
            },
            {
                name: "thcPotency",
                type: "float",
                isNullable: false
            },
            {
                name: "cbdPotency",
                type: "float",
                isNullable: false
            },
            {
                name: "notes",
                type: "varchar",
                isNullable: true
            }
        ]
    });

    purchase = new Table({
        name: "purchase",
        columns: [
            idColumn,
            {
                name: "dateAndTime",
                type: "timestamp",
                isNullable: false,
                default: "CURRENT_TIMESTAMP"
            },
            {
                name: "employeeId",
                type: "integer",
                isNullable: false
            },
            {
                name: "customerId",
                type: "integer",
                isNullable: true
            },
            {
                name: "notes",
                type: "varchar",
                isNullable: true
            }
        ]
    });

    adjustment = new Table({
        name: "adjustment",
        columns: [
            idColumn,
            {
                name: "amount",
                type: "float",
                isNullable: false
            },
            {
                name: "purchaseId",
                type: "int",
                isNullable: false
            }
        ]
    });

    purchaseBatch = new Table({
        name: "purchase_batch",
        columns: [
            idColumn,
            {
                name: "purchaseId",
                type: "int",
                isNullable: false
            },
            {
                name: "batchId",
                type: "int",
                isNullable: false
            },
            {
                name: "amount",
                type: "float",
                isNullable: false
            }
        ]
    });

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(this.strainType, true);
        await queryRunner.createTable(this.strain, true);
        await queryRunner.createForeignKeys(this.strain,
            [
                new TableForeignKey({
                    columnNames: ["strainTypeId"],
                    referencedTableName: "strain_type",
                    referencedColumnNames: ["id"]
                })
            ]
        );

        await queryRunner.createTable(this.batch, true);
        await queryRunner.createForeignKeys(this.batch,
            [
                new TableForeignKey({
                    columnNames: ["strainId"],
                    referencedTableName: "strain",
                    referencedColumnNames: ["id"]
                })
            ]
        );

        await queryRunner.createTable(this.purchase, true);
        await queryRunner.createForeignKeys(this.purchase,
            [
                new TableForeignKey({
                    columnNames: ["employeeId"],
                    referencedTableName: "person",
                    referencedColumnNames: ["id"]
                }),
                new TableForeignKey({
                    columnNames: ["customerId"],
                    referencedTableName: "person",
                    referencedColumnNames: ["id"]
                })
            ]
        );

        await queryRunner.createTable(this.adjustment, true);
        await queryRunner.createForeignKeys(this.adjustment,
            [
                new TableForeignKey({
                    columnNames: ["purchaseId"],
                    referencedTableName: "purchase",
                    referencedColumnNames: ["id"]
                })
            ]
        );

        await queryRunner.createTable(this.purchaseBatch, true);
        await queryRunner.createForeignKeys(this.purchaseBatch,
            [
                new TableForeignKey({
                    columnNames: ["purchaseId"],
                    referencedTableName: "purchase",
                    referencedColumnNames: ["id"]
                })
            ]
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.purchaseBatch);
        await queryRunner.dropTable(this.adjustment);
        await queryRunner.dropTable(this.purchase);
        await queryRunner.dropTable(this.batch);
        await queryRunner.dropTable(this.strain);
        await queryRunner.dropTable(this.strainType);
    }

}
