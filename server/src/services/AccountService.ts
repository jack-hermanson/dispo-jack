import { Account } from "../models/Account";
import * as bcrypt from "bcryptjs";
import { getConnection, Repository } from "typeorm";
import { AccountPerson } from "../models/AccountPerson";
import { Person } from "../models/Person";
import { Role } from "../models/Role";
import { AccountRole } from "../models/AccountRole";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { Response } from "express";
import { PersonService } from "./PersonService";
import { AccountAndPersonType, AuthRequest } from "../utils/types";
import * as jwt from "jsonwebtoken";
import { RoleService } from "./RoleService";
import {
    LoginRequest,
    NewAccountRequest,
    RegisterRequest,
    TokenLoginRequest,
} from "../../../shared/resource_models/account";

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
    return {
        accountRepo,
        personRepo,
        accountPersonRepo,
        roleRepo,
        accountRoleRepo,
    };
};

export abstract class AccountService {
    static async createAccount(
        requestBody: NewAccountRequest,
        res: Response
    ): Promise<AccountAndPersonType | undefined> {
        const { accountRepo, accountPersonRepo } = getRepos();

        // is this personId a real person?
        const person = await PersonService.getOnePerson(
            requestBody.personId,
            res
        );
        if (!person) {
            return;
        }

        // does an account already belong to this personId?
        if (
            !(await doesNotConflict<AccountPerson>({
                repo: accountPersonRepo,
                properties: [{ name: "personId", value: requestBody.personId }],
                res: res,
            }))
        ) {
            return undefined;
        }

        // does an account already exist with this username or email?
        if (
            !(await doesNotConflict<Account>({
                repo: accountRepo,
                properties: [
                    { name: "username", value: requestBody.username },
                    { name: "email", value: requestBody.email },
                ],
                res: res,
            }))
        ) {
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

        // get clearances
        const clearances = await RoleService.getUserClearances(newAccount.id);

        // return account and person
        return {
            account: newAccount,
            person: person,
            clearances: clearances,
        };
    }

    static async getAccounts(): Promise<AccountAndPersonType[]> {
        const output: AccountAndPersonType[] = [];

        const { accountRepo, personRepo, accountPersonRepo } = getRepos();
        const accountPeople = await accountPersonRepo.find();

        for (let accountPerson of accountPeople) {
            const person = await personRepo.findOne({
                id: accountPerson.personId,
            });
            const account = await accountRepo.findOne({
                id: accountPerson.accountId,
            });
            const clearances = await RoleService.getUserClearances(
                accountPerson.accountId
            );
            output.push({ account, person, clearances });
        }

        return output;
    }

    static async getOneAccount(
        id: number,
        res: Response
    ): Promise<AccountAndPersonType | undefined> {
        const { accountRepo, personRepo, accountPersonRepo } = getRepos();
        const accountPerson = await accountPersonRepo.findOne({
            accountId: id,
        });
        if (!accountPerson) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        const account = await accountRepo.findOne({
            id: accountPerson.accountId,
        });
        const person = await personRepo.findOne({ id: accountPerson.personId });
        const clearances = await RoleService.getUserClearances(account.id);

        return { account, person, clearances };
    }

    /**
     * Register: create new person and account.
     * @param requestBody
     * @param res
     */
    static async register(
        requestBody: RegisterRequest,
        res: Response
    ): Promise<AccountAndPersonType | undefined> {
        const person = await PersonService.createPerson(requestBody, res);
        if (!person) return undefined;
        const accountAndPerson = await this.createAccount(
            {
                personId: person.id,
                ...requestBody,
            },
            res
        );
        if (!accountAndPerson) return undefined;
        return accountAndPerson;
    }

    static async login(
        requestBody: LoginRequest,
        res: Response
    ): Promise<AccountAndPersonType> {
        const { accountRepo, personRepo, accountPersonRepo } = getRepos();
        const account = await accountRepo.findOne({
            username: requestBody.username,
        });
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        const validPassword: boolean = await bcrypt.compare(
            requestBody.password,
            account.password
        );
        if (!validPassword) {
            res.status(HTTP.BAD_REQUEST).send("Wrong password.");
            return undefined;
        }

        const token = jwt.sign({ id: account.id }, process.env.SECRET_KEY);

        await accountRepo.update(account, { token: token });
        const editedAccount = await accountRepo.findOne({ id: account.id });

        const accountPerson = await accountPersonRepo.findOne({
            accountId: account.id,
        });
        const person = await personRepo.findOne({ id: accountPerson.personId });
        const clearances = await RoleService.getUserClearances(account.id);

        return {
            account: editedAccount,
            person: person,
            clearances: clearances,
        };
    }

    /**
     * Returns true if logout was successful.
     */
    static async logout(
        req: AuthRequest<any>,
        res: Response
    ): Promise<boolean> {
        const { accountRepo } = getRepos();
        const account = await accountRepo.findOne({ id: req.account.id });
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return false;
        }
        await accountRepo.update(account, { token: null });
        const updatedAccount = await accountRepo.findOne({ id: account.id });
        if (updatedAccount.token === null) {
            return true;
        } else {
            res.sendStatus(HTTP.SERVER_ERROR);
            return false;
        }
    }

    /**
     * Logs user in using saved token between sessions.
     */
    static async tokenLogin(
        requestBody: TokenLoginRequest,
        res: Response
    ): Promise<AccountAndPersonType | undefined> {
        const { accountRepo, accountPersonRepo, personRepo } = getRepos();

        const account = await accountRepo.findOne({ token: requestBody.token });
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        const accountPerson = await accountPersonRepo.findOne({
            accountId: account.id,
        });
        const person = await personRepo.findOne({ id: accountPerson.personId });
        const clearances = await RoleService.getUserClearances(account.id);

        return {
            account: account,
            person: person,
            clearances: clearances,
        };
    }
}
