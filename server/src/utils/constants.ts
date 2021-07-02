import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

const apiPrefix = "/api";

export const routePrefixes = {
    main: `${apiPrefix}`,
    roles: `${apiPrefix}/roles`,
    people: `${apiPrefix}/people`,
    accounts: `${apiPrefix}/account`,
    strains: `${apiPrefix}/strains`,
    batches: `${apiPrefix}/batches`,
};

export enum HTTP_STATUS {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    SERVER_ERROR = 500,
}

export const idColumn: TableColumnOptions = {
    name: "id",
    type: "integer",
    isPrimary: true,
    isGenerated: true,
    generationStrategy: "increment",
};
