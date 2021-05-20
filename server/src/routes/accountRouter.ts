import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {Connection, getConnection, Repository} from "typeorm";
import {Account, NewAccountRequest} from "../entities/Account";
import {Person, PersonRequest} from "../entities/Person";
import {Role} from "../entities/Role";

export const accountRouter = express.Router();

// repos
interface Repos {accountRepo: Repository<Account>; personRepo: Repository<Person>; roleRepo: Repository<Role>}
const getRepos = (): Repos => {
    const connection: Connection = getConnection();
    const accountRepo: Repository<Account> = connection.getRepository(Account);
    const personRepo: Repository<Person> = connection.getRepository(Person);
    const roleRepo: Repository<Role> = connection.getRepository(Role);
    return {accountRepo, personRepo, roleRepo};
};

// info
const alreadyExists = (prop: string) => `That ${prop} is not available.`;
