import express, {Response} from "express";
import {AuthRequest} from "../utils/types";
import {HTTP_STATUS} from "../utils/constants";
import {Connection, getConnection, Repository} from "typeorm";
import {Role} from "../entities/Role";

export const roleRouter = express.Router();

// repos
const getRepos = (): {roleRepo: Repository<Role>} => {
    const connection: Connection = getConnection();
    const roleRepo: Repository<Role> = connection.getRepository(Role);
    return {roleRepo};
};

// new role
roleRouter.post("/", async (req: AuthRequest<Role>, res: Response) => {
    try {
        const role: Role = new Role();
        role.name = req.body.name;
        role.clearance = req.body.clearance;
        if (!role.name || !role.clearance) return res.sendStatus(HTTP_STATUS.BAD_REQUEST);

        const newRole = await getRepos().roleRepo.save(role);
        res.status(HTTP_STATUS.CREATED).json(newRole);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// get all roles
roleRouter.get("/", async (req: AuthRequest<any>, res: Response) => {
    try {
        const roles = await getRepos().roleRepo.find();
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// get one role
roleRouter.get("/:id", async (req: AuthRequest<any>, res: Response) => {
    try {
        const role = await getRepos().roleRepo.findOne({id: req.params.id});
        if (!role) return res.sendStatus(HTTP_STATUS.NOT_FOUND);
        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// update a role
roleRouter.put("/:id", async (req: AuthRequest<Role>, res: Response) => {
    try {
        const roleRepo = getRepos().roleRepo;
        const role = await roleRepo.findOne({id: req.params.id});
        if (!role) return res.sendStatus(HTTP_STATUS.NOT_FOUND);

        if (!req.body.name || !req.body.clearance) {
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST);
        }

        await roleRepo.update(role, {
            name: req.body.name,
            clearance: req.body.clearance
        });

        const newRole = await roleRepo.findOne(req.params.id);

        res.json(newRole);

    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

// delete a role
roleRouter.delete("/:id", async (req: AuthRequest<any>, res: Response) => {
    // todo
    res.send(null);
});
