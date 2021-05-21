import {getConnection, Repository} from "typeorm";
import {NewRoleRequest, Role} from "../entities/Role";
import {doesNotConflict} from "../utils/validation";
import {Response} from "express";

const getRepos = (): {roleRepo: Repository<Role>} => {
    const connection = getConnection();
    const roleRepo = connection.getRepository(Role);
    return {roleRepo};
}

export const createRole = async (requestBody: NewRoleRequest, res: Response): Promise<Role | undefined> => {
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
}
