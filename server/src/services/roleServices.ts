import {getConnection, Repository} from "typeorm";
import {RoleRequest, Role} from "../entities/Role";
import {doesNotConflict} from "../utils/validation";
import {Response} from "express";
import {HTTP_STATUS} from "../utils/constants";
import {AccountRole} from "../entities/AccountRole";
import {Account} from "../entities/Account";
import {getOneAccount} from "./accountServices";

const getRepos = (): {
    roleRepo: Repository<Role>;
    accountRoleRepo: Repository<AccountRole>;
} => {
    const connection = getConnection();
    const roleRepo = connection.getRepository(Role);
    const accountRoleRepo = connection.getRepository(AccountRole);
    return {roleRepo, accountRoleRepo};
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

export const applyRole = async (
    accountId: number, roleId: number, res: Response, currentUser: Account
): Promise<AccountRole | undefined> => {

    // is the account id legit?
    const account = await getOneAccount(accountId, res);
    if (!account) {
        return undefined;
    }

    // is the role id legit?
    const role = await getOneRole(roleId, res);
    if (!role) {
        return undefined;
    }

    // repos
    const {accountRoleRepo} = getRepos();

    // does this already exist?
    const existingAccountRole = await accountRoleRepo.findOne({roleId: roleId, accountId: accountId});
    if (existingAccountRole) {
        res.status(HTTP_STATUS.CONFLICT).json({
            message: "User already has that role.",
            existingAccountRole: existingAccountRole
        });
        return undefined;
    }

    // check clearance
    const currentAccountRoles = await accountRoleRepo.find({
        accountId: currentUser.id
    });

    // current user
    const currentUserClearances = await getUserClearances(currentUser.id);
    const currentUserIsAdmin: boolean = currentUserClearances.some(clearance => clearance >= 5);
    const currentUserIsSuperAdmin: boolean = currentUserClearances.some(clearance => clearance === 10);

    // affected user
    const affectedUserClearances = await getUserClearances(accountId);
    const affectedUserIsSuperAdmin: boolean = affectedUserClearances.some(clearance => clearance === 10);

    // is current user allowed to modify roles?
    if (!currentUserIsAdmin) {
        res.status(HTTP_STATUS.FORBIDDEN).send("Only admins can apply roles.");
        return undefined;
    }
    if (affectedUserIsSuperAdmin && !currentUserIsSuperAdmin) {
        res.status(HTTP_STATUS.FORBIDDEN).send("Only super admins can apply roles to super admins.");
        return undefined;
    }
    if (!currentUserIsSuperAdmin && (role.clearance >= 5)) {
        res.status(HTTP_STATUS.FORBIDDEN).send("Only super admins can make other users admins.");
        return undefined;
    }

    // save
    const accountRole = new AccountRole();
    accountRole.accountId = accountId;
    accountRole.roleId = roleId;

    // save
    return await accountRoleRepo.save(accountRole);
};

// get list of user clearances
export const getUserClearances = async (accountId: number): Promise<number[]> => {

    // repos
    const {accountRoleRepo, roleRepo} = getRepos();

    // get accountRoles
    const accountRoles = await accountRoleRepo.find({accountId: accountId});

    // get roles / clearances
    const clearances: number[] = [];
    for (let accountRole of accountRoles) {
        const role = await roleRepo.findOne({id: accountRole.roleId});
        clearances.push(role.clearance);
    }

    return clearances;
};

// get user roles
export const getUserRoles = async (accountId: number) => {

    // repos
    const {accountRoleRepo, roleRepo} = getRepos();

    // get user accountRoles
    const accountRoles: AccountRole[] = await accountRoleRepo.find({accountId: accountId});

    // get roles
    const roles: Role[] = [];
    for (let accountRole of accountRoles) {
        const role = await roleRepo.findOne({id: accountRole.roleId});
        roles.push(role);
    }

    return roles;
};
