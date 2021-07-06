import { getConnection, Repository } from "typeorm";
import { Role } from "../models/Role";
import { RoleRequest } from "../../../shared/resource_models/role";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { Response } from "express";
import { AccountRole } from "../models/AccountRole";
import { Account } from "../models/Account";
import { AccountService } from "./AccountService";

const getRepos = (): {
    roleRepo: Repository<Role>;
    accountRoleRepo: Repository<AccountRole>;
} => {
    const connection = getConnection();
    const roleRepo = connection.getRepository(Role);
    const accountRoleRepo = connection.getRepository(AccountRole);
    return { roleRepo, accountRoleRepo };
};

export abstract class RoleService {
    static async createRole(
        requestBody: RoleRequest,
        res: Response
    ): Promise<Role | undefined> {
        // get repository
        const { roleRepo } = getRepos();

        // check uniqueness
        if (
            !(await doesNotConflict<Role>({
                repo: roleRepo,
                properties: [{ name: "name", value: requestBody.name }],
                res: res,
            }))
        ) {
            return undefined;
        }

        // save
        const role = new Role();
        role.name = requestBody.name;
        role.clearance = requestBody.clearance;

        return await roleRepo.save(role);
    }

    static async getRoles(): Promise<Role[]> {
        const { roleRepo } = getRepos();
        return await roleRepo.find();
    }

    static async getOneRole(
        id: number,
        res: Response
    ): Promise<Role | undefined> {
        const { roleRepo } = getRepos();
        const role = await roleRepo.findOne({ id: id });
        if (!role) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return role;
    }

    static async editRole(
        id: number,
        requestBody: RoleRequest,
        res: Response
    ): Promise<Role | undefined> {
        const role = await this.getOneRole(id, res);
        if (!role) return undefined;

        // check uniqueness
        const { roleRepo } = getRepos();
        if (
            !(await doesNotConflict<Role>({
                repo: roleRepo,
                properties: [{ name: "name", value: requestBody.name }],
                res: res,
                existingRecord: role,
            }))
        ) {
            return undefined;
        }

        // save edits
        await roleRepo.update(role, requestBody);
        return await roleRepo.findOne({ id: id });
    }

    static async applyRole(
        accountId: number,
        roleId: number,
        res: Response,
        currentUser: Account
    ): Promise<AccountRole | undefined> {
        // is the account id legit?
        const account = await AccountService.getOneAccount(accountId, res);
        if (!account) {
            return undefined;
        }

        // is the role id legit?
        const role = await this.getOneRole(roleId, res);
        if (!role) {
            return undefined;
        }

        // repos
        const { accountRoleRepo } = getRepos();

        // does this already exist?
        const existingAccountRole = await accountRoleRepo.findOne({
            roleId: roleId,
            accountId: accountId,
        });
        if (existingAccountRole) {
            res.status(HTTP.CONFLICT).json({
                message: "User already has that role.",
                existingAccountRole: existingAccountRole,
            });
            return undefined;
        }

        // current user
        const currentUserClearances = await this.getUserClearances(
            currentUser.id
        );
        const currentUserIsAdmin: boolean = currentUserClearances.some(
            clearance => clearance >= 5
        );
        const currentUserIsSuperAdmin: boolean = currentUserClearances.some(
            clearance => clearance === 10
        );

        // affected user
        const affectedUserClearances = await this.getUserClearances(accountId);
        const affectedUserIsSuperAdmin: boolean = affectedUserClearances.some(
            clearance => clearance === 10
        );

        // is current user allowed to modify roles?
        if (!currentUserIsAdmin) {
            res.status(HTTP.FORBIDDEN).send("Only admins can apply roles.");
            return undefined;
        }
        if (affectedUserIsSuperAdmin && !currentUserIsSuperAdmin) {
            res.status(HTTP.FORBIDDEN).send(
                "Only super admins can apply roles to super admins."
            );
            return undefined;
        }
        if (!currentUserIsSuperAdmin && role.clearance >= 5) {
            res.status(HTTP.FORBIDDEN).send(
                "Only super admins can make other users admins."
            );
            return undefined;
        }

        // save
        const accountRole = new AccountRole();
        accountRole.accountId = accountId;
        accountRole.roleId = roleId;

        // save
        return await accountRoleRepo.save(accountRole);
    }

    // get list of user clearances
    static async getUserClearances(accountId: number): Promise<number[]> {
        // repos
        const { accountRoleRepo, roleRepo } = getRepos();

        // get accountRoles
        const accountRoles = await accountRoleRepo.find({
            accountId: accountId,
        });

        // get roles / clearances
        const clearances: number[] = [];
        for (let accountRole of accountRoles) {
            const role = await roleRepo.findOne({ id: accountRole.roleId });
            clearances.push(role.clearance);
        }

        return clearances;
    }

    // does user have this clearance or above?
    static async hasMinClearance(
        accountId: number,
        clearance: number,
        res: Response
    ): Promise<boolean> {
        // clearances
        const clearances = await this.getUserClearances(accountId);
        const okay = clearances.some(c => c >= clearance);
        if (okay) {
            return true;
        } else {
            res.sendStatus(HTTP.FORBIDDEN);
            return false;
        }
    }

    // get user roles
    static async getUserRoles(accountId: number): Promise<Role[]> {
        // repos
        const { accountRoleRepo, roleRepo } = getRepos();

        // get user accountRoles
        const accountRoles: AccountRole[] = await accountRoleRepo.find({
            accountId: accountId,
        });

        // get roles
        const roles: Role[] = [];
        for (let accountRole of accountRoles) {
            const role = await roleRepo.findOne({ id: accountRole.roleId });
            roles.push(role);
        }

        return roles;
    }
}
