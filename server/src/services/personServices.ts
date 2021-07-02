import { getConnection, Repository } from "typeorm";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { Response } from "express";
import { Person, PersonRequest } from "../models/Person";

const getRepos = (): { personRepo: Repository<Person> } => {
    const connection = getConnection();
    const personRepo = connection.getRepository(Person);
    return { personRepo };
};

export const createPerson = async (
    requestBody: PersonRequest,
    res: Response
): Promise<Person | undefined> => {
    const { personRepo } = getRepos();

    if (
        !(await doesNotConflict<Person>({
            repo: personRepo,
            properties: [{ name: "phone", value: requestBody.phone }],
            res: res,
        }))
    ) {
        return undefined;
    }

    const person = new Person();
    person.firstName = requestBody.firstName;
    person.lastName = requestBody.lastName;
    person.phone = requestBody.phone;

    return await personRepo.save(person);
};

export const getPeople = async (): Promise<Person[]> => {
    const { personRepo } = getRepos();
    return await personRepo.find();
};

export const getOnePerson = async (
    id: number,
    res: Response
): Promise<Person | undefined> => {
    const { personRepo } = getRepos();
    const person = await personRepo.findOne({ id: id });
    if (!person) {
        res.sendStatus(HTTP.NOT_FOUND);
        return undefined;
    }
    return person;
};

export const editPerson = async (
    id: number,
    requestBody: PersonRequest,
    res: Response
): Promise<Person | undefined> => {
    const person = await getOnePerson(id, res);
    if (!person) return undefined;

    const { personRepo } = getRepos();
    if (
        !(await doesNotConflict<Person>({
            repo: personRepo,
            properties: [{ name: "phone", value: requestBody.phone }],
            res: res,
            existingRecord: person,
        }))
    ) {
        return undefined;
    }

    await personRepo.update(person, requestBody);
    return await personRepo.findOne({ id: id });
};
