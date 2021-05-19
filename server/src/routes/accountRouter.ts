import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {Connection, getConnection, Repository} from "typeorm";
import {Account, AccountRequest} from "../entities/Account";
import {getMissingProps} from "../utils/functions";
import {Person} from "../entities/Person";

export const accountRouter = express.Router();

// repos
const getRepos = (): {accountRepo: Repository<Account>, personRepo: Repository<Person>} => {
    const connection: Connection = getConnection();
    const accountRepo: Repository<Account> = connection.getRepository(Account);
    const personRepo: Repository<Person> = connection.getRepository(Person);
    return {accountRepo, personRepo};
};

// info
const requiredProps = ["username", "password", "personId"];
const alreadyExists = (prop: string) => `That ${prop} is not available.`;

// validate new/edited account
const validateAccount = async (requestBody: AccountRequest, res: Response): Promise<boolean> => {
    const {accountRepo, personRepo} = getRepos();

    // username
    const accountWithUsername = await accountRepo.find({username: requestBody.username});
    if (accountWithUsername.length) {
        res.status(HTTP_STATUS.CONFLICT).send(alreadyExists("username"));
        return false;
    }

    // email
    if (requestBody.email) {
        const accountWithEmail = await accountRepo.find({email: requestBody.email});
        if (accountWithEmail) {
            res.status(HTTP_STATUS.CONFLICT).send(alreadyExists("email"));
            return false;
        }
    }

    // personId
    const person = await personRepo.findOne({id: requestBody.personId});
    if (!person) {
        res.status(HTTP_STATUS.NOT_FOUND).send("That personId isn't valid.");
        return false;
    }
    const accountWithPerson = await accountRepo.find({person: person});
    if (accountWithPerson.length) {
        res.status(HTTP_STATUS.CONFLICT).send(alreadyExists("personId"));
        return false;
    }

    return true;
}

// new account
accountRouter.post("/", async (req: AuthRequest<AccountRequest>, res: Response) => {
    try {
        // validation
        const missingProps = getMissingProps(req, requiredProps);
        if (missingProps.length) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({missingProps: missingProps});
        }

        // check for existence
        const {accountRepo, personRepo} = getRepos();
        let requestBody: AccountRequest = req.body;
        requestBody = {
            ...requestBody,
            email: requestBody.email?.toLowerCase(),
            username: requestBody.username.toLowerCase()
        }

        if (!await validateAccount(requestBody, res)) return;

        // person
        const person = await personRepo.findOne({id: requestBody.personId});

        // save
        const account = new Account();
        account.username = requestBody.username;
        account.email = requestBody.email;
        account.password = requestBody.password; // todo
        account.person = person;

        const newAccount = await accountRepo.save(account);
        res.status(HTTP_STATUS.CREATED).json(newAccount);

    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// get accounts
accountRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    try {
        const accountRepo = getRepos().accountRepo;
        const accounts = await accountRepo.find();
        for (let account of accounts) {
            delete account.password;
            delete account.token;
        }
        res.json(accounts);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// get one account
accountRouter.get("/:id", async (req: AuthRequest<any>, res: Response) => {
    try {
        const {accountRepo} = getRepos();
        const account = await accountRepo.findOne({id: req.params.id});
        if (!account) return res.sendStatus(HTTP_STATUS.NOT_FOUND);
        delete account.password;
        delete account.token;
        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});
