import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import {idColumn} from "../utils/constants";

export class Weed1621922119960 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // new tables

        const strainType = new Table({
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

        const strain = new Table({
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

        const batch = new Table({
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
