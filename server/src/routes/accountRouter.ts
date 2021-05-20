import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {Connection, getConnection, Repository} from "typeorm";
import {Account, AccountRequest} from "../entities/Account";
import {getMissingProps} from "../utils/functions";
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
const requiredAccountProps = ["username", "password", "personId"];
const requiredPersonAndAccountProps = ["username", "password", "firstName", "lastName"];
const alreadyExists = (prop: string) => `That ${prop} is not available.`;

// validate new/edited account
const validateAccount = async (requestBody: AccountRequest, res: Response, account?: Account): Promise<boolean> => {
    const {accountRepo, personRepo} = getRepos();

    // username
    const accountWithUsername = await accountRepo.findOne({username: requestBody.username});
    if (accountWithUsername) {
        if (!account || (account.id !== accountWithUsername.id)) {
            res.status(HTTP_STATUS.CONFLICT).send(alreadyExists("username"));
            return false;
        }
    }

    // email
    if (requestBody.email) {
        const accountWithEmail = await accountRepo.findOne({email: requestBody.email});
        if (accountWithEmail) {
            if (!account || (account.id !== accountWithEmail.id)) {
                res.status(HTTP_STATUS.CONFLICT).send(alreadyExists("email"));
                return false;
            }
        }
    }

    // personId
    const person = await personRepo.findOne({id: requestBody.personId});
    if (!person) {
        res.status(HTTP_STATUS.NOT_FOUND).send("That personId isn't valid.");
        return false;
    }
    const accountWithPerson = await accountRepo.findOne({person: person});
    if (accountWithPerson) {
        if (!account || account.id !== accountWithPerson.id) {
            res.status(HTTP_STATUS.CONFLICT).send(alreadyExists("personId"));
            return false;
        }
    }

    return true;
}

// new account
accountRouter.post("/", async (req: AuthRequest<AccountRequest>, res: Response) => {
    try {
        // validation
        const missingProps = getMissingProps(req, requiredAccountProps);
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

// new person AND account
interface RegisterRequest extends AccountRequest, PersonRequest {}
accountRouter.post("/register", async (req: AuthRequest<RegisterRequest>, res: Response) => {
    try {
        // get info from request
        const missingProps = getMissingProps(req, requiredPersonAndAccountProps);
        if (missingProps.length) return res.status(HTTP_STATUS.BAD_REQUEST).json({missingProps});
        const requestBody: RegisterRequest = req.body;
        requestBody.username = requestBody.username.toLowerCase();
        requestBody.email = requestBody.email?.toLowerCase();

        // repos
        const {accountRepo, personRepo} = getRepos();
        if (!await validateAccount(requestBody, res)) {
            return;
        }

        // make person
        const person = new Person();
        person.firstName = requestBody.firstName;
        person.lastName = requestBody.lastName;
        const newPerson = await personRepo.save(person);

        // make account
        const account = new Account();
        account.username = requestBody.username;
        account.email = requestBody.email;
        account.password = requestBody.password; // todo
        account.person = newPerson;
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

// edit account
interface EditAccountRequest extends AccountRequest {id: number}
accountRouter.put("/:id", async (req: AuthRequest<EditAccountRequest>, res: Response) => {
    try {
        // get request body
        const missingProps = getMissingProps(req, ["personId", "username"]);
        if (missingProps.length) return res.status(HTTP_STATUS.BAD_REQUEST).json({missingProps});
        const requestBody: EditAccountRequest = req.body;

        // find existing account
        const {accountRepo, roleRepo} = getRepos();
        const account = await accountRepo.findOne({id: req.params.id});
        if (!account) return res.sendStatus(HTTP_STATUS.NOT_FOUND);

        // check for conflicts
        if (!await validateAccount(requestBody, res, account)) {
            return;
        }

        // save changes
        await accountRepo.update(account, {
            username: requestBody.username
        });

        // return updated account
        const newAccount = await accountRepo.findOne({id: req.params.id});
        delete newAccount.token;
        delete newAccount.password;
        return res.json({...newAccount});

    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// change password
accountRouter.patch("/:id", async (req: AuthRequest<{ password: string; id: number; }>, res: Response) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
})
