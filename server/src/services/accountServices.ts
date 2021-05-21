import {Account, NewAccountRequest} from "../entities/Account";
import {HTTP_STATUS} from "../utils/constants";
import * as bcrypt from "bcryptjs";
import {Connection, getConnection, Repository} from "typeorm";
import {AccountPerson} from "../entities/AccountPerson";
import {Person} from "../entities/Person";
import {Role} from "../entities/Role";
import {AccountRole} from "../entities/AccountRole";
import {doesNotConflict} from "../utils/validation";
import {Response} from "express";
import {getOnePerson} from "./personServices";

const getRepos = (): {
    accountRepo: Repository<Account>;
    personRepo: Repository<Person>;
    accountPersonRepo: Repository<AccountPerson>;
    roleRepo: Repository<Role>;
    accountRoleRepo: Repository<AccountRole>;
} => {
    const connection = getConnection();
    const accountRepo = connection.getRepository(Account);
    const personRepo = connection.getRepository(Person);
    const accountPersonRepo = connection.getRepository(AccountPerson);
    const roleRepo = connection.getRepository(Role);
    const accountRoleRepo = connection.getRepository(AccountRole);
    return {accountRepo, personRepo, accountPersonRepo, roleRepo, accountRoleRepo};
};


// create account for existing person
export const createAccount = async (requestBody: NewAccountRequest, res: Response): Promise<{
    account: Account;
    person: Person;
} | undefined> => {
    const {accountRepo, accountPersonRepo} = getRepos();

    // is this personId a real person?
    const person = await getOnePerson(requestBody.personId, res);
    if (!person) {
        return;
    }

    // does an account already belong to this personId?
    if (!await doesNotConflict<AccountPerson>({
        repo: accountPersonRepo,
        properties: [
            {name: "personId", value: requestBody.personId}
        ],
        res: res
    })) {
        return undefined;
    }

    // does an account already exist with this username or email?
    if (!await doesNotConflict<Account>({
        repo: accountRepo,
        properties: [
            {name: "username", value: requestBody.username},
            {name: "email", value: requestBody.email}
        ],
        res: res
    })) {
        return undefined;
    }

    // create the new account
    const salt = await bcrypt.genSalt(10);

    const account = new Account();
    account.username = requestBody.username;
    account.email = requestBody.email;
    account.password = await bcrypt.hash(requestBody.password, salt);

    const newAccount = await accountRepo.save(account);

    // create the accountPerson relationship
    const accountPerson = new AccountPerson();
    accountPerson.accountId = newAccount.id;
    accountPerson.personId = requestBody.personId;
    await accountPersonRepo.save(accountPerson);

    // return account and person
    return {
        account: newAccount,
        person: person
    };
}
