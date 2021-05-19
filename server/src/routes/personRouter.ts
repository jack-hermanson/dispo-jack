import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {Connection, getConnection, Repository} from "typeorm";
import {Person} from "../entities/Person";
import {getMissingProps} from "../utils/functions";

export const personRouter = express.Router();

// repos
const getRepos = (): {personRepo: Repository<Person>} => {
    const connection: Connection = getConnection();
    const personRepo: Repository<Person> = connection.getRepository(Person);
    return {personRepo};
};

// create new person
personRouter.post("/", async (req: AuthRequest<Person>, res: Response) => {
    try {
        const personRepo = getRepos().personRepo;

        // validate
        const missingProps = getMissingProps(req, ["firstName", "lastName"]);
        if (missingProps.length) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({missingProps: missingProps});
        }

        const {firstName, lastName} = req.body;
        const similarPeople = await personRepo.find({firstName: firstName, lastName: lastName});
        if (similarPeople.length) {
            return res.status(HTTP_STATUS.CONFLICT).send("A person with that name already exists.");
        }

        // save
        const person = new Person();
        person.firstName = firstName;
        person.lastName = lastName;
        const newPerson = await personRepo.save(person);

        res.status(HTTP_STATUS.CREATED).json(newPerson);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// get all people
personRouter.get("/", async (req: AuthRequest<Person>, res: Response) => {
    try {
        const personRepo = getRepos().personRepo;
        const people = await personRepo.find();
        res.json(people);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// get one person
personRouter.get("/:id", async (req: AuthRequest<any>, res: Response) => {
    try {
        const personRepo = getRepos().personRepo;
        const person = await personRepo.findOne({id: req.params.id});
        if (!person) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND);
        }
        res.json(person);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// update a person
personRouter.put("/:id", async (req: AuthRequest<Person>, res: Response) => {
    try {
        const personRepo = getRepos().personRepo;

        // validate
        const person = await personRepo.findOne({id: req.params.id});
        if (!person) return res.sendStatus(HTTP_STATUS.NOT_FOUND);

        const missingProps = getMissingProps(req, ["firstName", "lastName"]);
        if (missingProps.length) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({missingProps: missingProps});
        }

        // update
        const {firstName, lastName} = req.body;
        await personRepo.update(person, {firstName: firstName, lastName: lastName});

        // return updated version
        const newPerson = await personRepo.findOne({id: req.params.id});
        res.json(newPerson);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// delete a person
personRouter.delete("/:id", async (req: AuthRequest<any>, res: Response) => {
    try {
        const personRepo = getRepos().personRepo;

        // validate
        const person = await personRepo.findOne({id: req.params.id});
        if (!person) return res.sendStatus(HTTP_STATUS.NOT_FOUND);

        // delete
        await personRepo.delete(person);
        res.sendStatus(HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});
