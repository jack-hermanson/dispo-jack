import {getConnection, Repository} from "typeorm";
import {RoleRequest, Role} from "../entities/Role";
import {doesNotConflict} from "../utils/validation";
import {Response} from "express";
import {HTTP_STATUS} from "../utils/constants";

const getRepos = (): {roleRepo: Repository<Role>} => {
    const connection = getConnection();
    const roleRepo = connection.getRepository(Role);
    return {roleRepo};
};

export const createRole = async (requestBody: RoleRequest, res: Response): Promise<Role | undefined> => {
    // get repository
    const {roleRepo} = getRepos();

    // check uniqueness
    if (!await doesNotConflict<Role>({
        repo: roleRepo,
        properties: [
            {name: "name", value: requestBody.name}
        ],
        res: res
    })) {
        return undefined;
    }

    // save
    const role = new Role();
    role.name = requestBody.name;
    role.clearance = requestBody.clearance;

    return await roleRepo.save(role);
};

export const getRoles = async (): Promise<Role[]> => {
    const {roleRepo} = getRepos();
    return await roleRepo.find();
};

export const getOneRole = async (id: number, res: Response): Promise<Role | undefined> => {
    const {roleRepo} = getRepos();
    const role = await roleRepo.findOne({id: id});
    if (!role) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND);
        return undefined;
    }
    return role;
};

export const editRole = async (id: number, requestBody: RoleRequest, res: Response): Promise<Role | undefined> => {
    const role = await getOneRole(id, res);
    if (!role) return undefined;

    // check uniqueness
    const {roleRepo} = getRepos();
    if (!await doesNotConflict<Role>({
        repo: roleRepo,
        properties: [
            {name: "name", value: requestBody.name}
        ],
        res: res,
        existingRecord: role
    })) {
        return undefined;
    }

    // save edits
    await roleRepo.update(role, requestBody);
    return await roleRepo.findOne({id: id});
};
