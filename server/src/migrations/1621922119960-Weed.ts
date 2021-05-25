import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import {StrainType} from "../entities/StrainType";
import {idColumn} from "../utils/constants";

export class Weed1621922119960 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // new tables

        const strainType: Table = new Table({
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

        const strain: Table = new Table({
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
