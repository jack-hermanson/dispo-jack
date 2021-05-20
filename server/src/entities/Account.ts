import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name: "account"})
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    username: string;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: true})
    token?: string;

}

export interface EditAccountRequest {
    username: string;
    email: string;
    personId: number;
}

export interface NewAccountRequest extends EditAccountRequest {
    password: string;
}
