import {Account, NewAccountRequest} from "../entities/Account";
import {HTTP_STATUS} from "../utils/constants";
import * as bcrypt from "bcryptjs";
import {Connection, getConnection} from "typeorm";
import {AccountPerson} from "../entities/AccountPerson";

// person must already exist
export const createAccount = async (requestBody: NewAccountRequest): Promise<Account> => {
    // todo
    // validate person
    return null;

}
