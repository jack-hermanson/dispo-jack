import {getConnection, Repository} from "typeorm";
import {doesNotConflict} from "../utils/validation";
import {Response} from "express";
import {HTTP_STATUS} from "../utils/constants";
import {Person, PersonRequest} from "../entities/Person";
import {Role} from "../entities/Role";

const getRepos = (): {personRepo: Repository<Person>} => {
    const connection = getConnection();
    const personRepo = connection.getRepository(Person);
    return {personRepo};
};

export const createPerson = async (requestBody: PersonRequest, res: Response): Promise<Person | undefined> => {
    const {personRepo} = getRepos();

    if (!await doesNotConflict<Person>({
        repo: personRepo,
        properties: [
            {name: "phone", value: requestBody.phone}
        ],
        res: res
    })) {
        return undefined;
    }

    const person = new Person();
    person.firstName = requestBody.firstName;
    person.lastName = requestBody.lastName;
    person.phone = requestBody.phone;

    return await personRepo.save(person);
};

export const getPeople = async (): Promise<Person[]> => {
    const {personRepo} = getRepos();
    return await personRepo.find();
};
