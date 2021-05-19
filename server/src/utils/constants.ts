const apiPrefix = "/api";

export const routePrefixes = {
    main: `${apiPrefix}`,
    roles: `${apiPrefix}/roles`
};


export enum HTTP_STATUS {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    CONFLICT = 409,
    SERVER_ERROR = 500
}
