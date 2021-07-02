import { ResourceModel } from "./_base";

export interface RoleRequest {
    name: string;
    clearance: number;
}

export interface RoleRecord extends RoleRequest, ResourceModel {}

export interface AccountRoleRequest {
    accountId: number;
    roleId: number;
}

export interface AccountRoleRecord extends AccountRoleRequest, ResourceModel {}
