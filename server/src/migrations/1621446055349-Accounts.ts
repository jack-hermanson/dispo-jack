import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";


export class Accounts1621446055349 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "role",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "clearance",
                    type: "integer",
                    isNullable: false,
                    default: 0
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "person",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "firstName",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "lastName",
                    type: "varchar",
                    isNullable: false
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "account",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "username",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "email",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "token",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "personId",
                    type: "integer"
                }
            ]
        }), true);

        await queryRunner.createForeignKey("account",
            new TableForeignKey({
                columnNames: ["personId"],
                referencedTableName: "person",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            }));

        await queryRunner.createTable(new Table({
            name: "account_role",
            columns: [
                {
                    name: "accountId",
                    type: "integer"
                },
                {
                    name: "roleId",
                    type: "integer"
                }
            ]
        }), true);

        await queryRunner.createForeignKey("account_role",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedTableName: "account",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            }));

        await queryRunner.createForeignKey("account_role",
            new TableForeignKey({
                columnNames: ["roleId"],
                referencedTableName: "role",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("account_role");
        await queryRunner.dropTable("account");
        await queryRunner.dropTable("person");
        await queryRunner.dropTable("role");
    }

}
