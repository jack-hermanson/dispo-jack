import { getConnection, Repository } from "typeorm";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { Response } from "express";
import { Person } from "../models/Person";
import { PersonRequest } from "../../../shared/resource_models/person";

const getRepos = (): { personRepo: Repository<Person> } => {
    const connection = getConnection();
    const personRepo = connection.getRepository(Person);
    return { personRepo };
};

export abstract class PersonService {
    static async createPerson(
        requestBody: PersonRequest,
        res: Response
    ): Promise<Person | undefined> {
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
        person.phone = requestBody.phone
            .replace("-", "")
            .replace("(", "")
            .replace(")", "")
            .replace(".", "");

        return await personRepo.save(person);
    }

    static async getPeople(): Promise<Person[]> {
        const { personRepo } = getRepos();
        return await personRepo.find();
    }

    static async getOnePerson(
        id: number,
        res: Response
    ): Promise<Person | undefined> {
        const { personRepo } = getRepos();
        const person = await personRepo.findOne({ id: id });
        if (!person) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return person;
    }

    static async editPerson(
        id: number,
        requestBody: PersonRequest,
        res: Response
    ): Promise<Person | undefined> {
        const person = await this.getOnePerson(id, res);
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
    }
}
