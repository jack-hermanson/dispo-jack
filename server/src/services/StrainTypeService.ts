import { getConnection, Repository } from "typeorm";
import { StrainType } from "../models/StrainType";
import { StrainTypeRequest } from "../../../shared/resource_models/strainType";
import { Response } from "express";
import { doesNotConflict } from "jack-hermanson-ts-utils";

const getRepos = (): {
    strainTypeRepo: Repository<StrainType>;
} => {
    const connection = getConnection();
    const strainTypeRepo = connection.getRepository(StrainType);
    return { strainTypeRepo };
};

export abstract class StrainTypeService {
    static async create(
        requestBody: StrainTypeRequest,
        res: Response
    ): Promise<StrainType | undefined> {
        // get repo
        const { strainTypeRepo } = getRepos();

        // unique?
        if (
            !(await doesNotConflict<StrainType>({
                repo: strainTypeRepo,
                properties: [{ name: "name", value: requestBody.name }],
                res: res,
            }))
        ) {
            return undefined;
        }

        // save
        const strainType = new StrainType();
        strainType.name = requestBody.name;

        return await strainTypeRepo.save(strainType);
    }

    static async getAll(): Promise<StrainType[]> {
        const { strainTypeRepo } = getRepos();
        return await strainTypeRepo.find();
    }
}
