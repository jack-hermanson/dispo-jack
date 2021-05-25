import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import {idColumn} from "../utils/constants";

export class PrimitiveAccount1621529788492 implements MigrationInterface {

    // new tables

    role: Table = new Table({
        name: "role",
        columns: [
            idColumn,
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
    });

    person: Table = new Table({
        name: "person",
        columns: [
            idColumn,
            {
                name: "firstName",
                type: "varchar",
                isNullable: false
            },
            {
                name: "lastName",
                type: "varchar",
                isNullable: false
            },
            {
                name: "phone",
                type: "varchar",
                isNullable: false
            }
        ]
    });

    account: Table = new Table({
        name: "account",
        columns: [
            idColumn,
            {
                name: "username",
                type: "varchar",
                isNullable: false,
                isUnique: true
            },
            {
                name: "email",
                type: "varchar",
                isNullable: false,
                isUnique: true
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
            }
        ]
    });

    accountRole: Table = new Table({
        name: "account_role",
        columns: [
            idColumn,
            {
                name: "accountId",
                type: "integer",
                isNullable: false
            },
            {
                name: "roleId",
                type: "integer",
                isNullable: true
            }
        ]
    });

    accountPerson: Table = new Table({
        name: "account_person",
        columns: [
            idColumn,
            {
                name: "accountId",
                type: "integer",
                isNullable: false,
                isUnique: true
            },
            {
                name: "personId",
                type: "integer",
                isNullable: false,
                isUnique: true
            }
        ]
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.role, true);
        await queryRunner.createTable(this.person, true);
        await queryRunner.createTable(this.account, true);

        await queryRunner.createTable(this.accountRole, true);
        await queryRunner.createForeignKeys(this.accountRole,
            [
                new TableForeignKey({
                    columnNames: ["accountId"],
                    referencedTableName: "account",
                    referencedColumnNames: ["id"]
                }),
                new TableForeignKey({
                    columnNames: ["roleId"],
                    referencedTableName: "role",
                    referencedColumnNames: ["id"]
                })
            ]
        );

        await queryRunner.createTable(this.accountPerson, true);
        await queryRunner.createForeignKeys(this.accountPerson,
            [
                new TableForeignKey({
                    columnNames: ["accountId"],
                    referencedTableName: "account",
                    referencedColumnNames: ["id"]
                }),
                new TableForeignKey({
                    columnNames: ["personId"],
                    referencedTableName: "person",
                    referencedColumnNames: ["id"]
                })
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.accountPerson);
        await queryRunner.dropTable(this.accountRole);
        await queryRunner.dropTable(this.account);
        await queryRunner.dropTable(this.person);
        await queryRunner.dropTable(this.role);
    }

}
