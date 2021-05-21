import {Account, LoginRequest, NewAccountRequest, RegisterRequest} from "../entities/Account";
import {HTTP_STATUS} from "../utils/constants";
import * as bcrypt from "bcryptjs";
import {getConnection, Repository} from "typeorm";
import {AccountPerson} from "../entities/AccountPerson";
import {Person} from "../entities/Person";
import {Role} from "../entities/Role";
import {AccountRole} from "../entities/AccountRole";
import {doesNotConflict} from "../utils/validation";
import {Response} from "express";
import {createPerson, getOnePerson} from "./personServices";
import {AccountAndPerson} from "../utils/types";
import * as jwt from "jsonwebtoken";

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
export const createAccount = async (requestBody: NewAccountRequest, res: Response): Promise<AccountAndPerson | undefined> => {
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
};

export const getAccounts = async (): Promise<AccountAndPerson[]> => {
    const output: AccountAndPerson[] = [];

    const {accountRepo, personRepo, accountPersonRepo} = getRepos();
    const accountPeople = await accountPersonRepo.find();

    for (let accountPerson of accountPeople) {
        const person = await personRepo.findOne({id: accountPerson.personId});
        const account = await accountRepo.findOne({id: accountPerson.accountId});
        output.push({account, person});
    }

    return output;
};

export const getOneAccount = async (id: number, res: Response): Promise<AccountAndPerson | undefined> => {
    const {accountRepo, personRepo, accountPersonRepo} = getRepos();
    const accountPerson = await accountPersonRepo.findOne({accountId: id});
    if (!accountPerson) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND);
        return undefined;
    }

    const account = await accountRepo.findOne({id: accountPerson.accountId});
    const person = await personRepo.findOne({id: accountPerson.personId});

    return {account, person};
}

// register (create new person and new account)
export const register = async (
    requestBody: RegisterRequest,
    res: Response
): Promise<AccountAndPerson | undefined> => {
    const person = await createPerson(requestBody, res);
    if (!person) return undefined;
    const accountAndPerson = await createAccount({
        personId: person.id,
        ...requestBody
    }, res);
    if (!accountAndPerson) return undefined;
    return accountAndPerson;
};

export const login = async (requestBody: LoginRequest, res: Response): Promise<AccountAndPerson> => {
    const {accountRepo, personRepo, accountPersonRepo} = getRepos();
    const account = await accountRepo.findOne({username: requestBody.username});
    if (!account) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND);
        return undefined;
    }
    const validPassword: boolean = await bcrypt.compare(requestBody.password, account.password);
    if (!validPassword) {
        res.status(HTTP_STATUS.BAD_REQUEST).send("Wrong password.");
        return undefined;
    }

    const token = jwt.sign(
        {id: account.id},
        process.env.SECRET_KEY,
        {
            expiresIn: "60 minutes"
        }
    );

    await accountRepo.update(account, {token: token});
    const editedAccount = await accountRepo.findOne({id: account.id});

    const accountPerson = await accountPersonRepo.findOne({accountId: account.id});
    const person = await personRepo.findOne({id: accountPerson.personId});

    return {
        account: editedAccount,
        person: person
    };
};
