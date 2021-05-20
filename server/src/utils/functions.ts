import {AuthRequest} from "./types";

export const getMissingProps = (request: AuthRequest<any>, requiredProps: string[]) => {
    const missingProps: string[] = [];

    for (let prop of requiredProps) {
        if (!request.body[prop]) {
            missingProps.push(prop);
        }
    }

    return missingProps;
}
