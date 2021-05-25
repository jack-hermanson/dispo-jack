import {getConnection, Repository} from "typeorm";
import {Strain} from "../entities/Strain";
import {StrainType, StrainTypeRequest} from "../entities/StrainType";
import {Response} from "express";
import {doesNotConflict} from "../utils/validation";

const getRepos = (): {
    strainRepo: Repository<Strain>,
    strainTypeRepo: Repository<StrainType>
} => {
    const connection = getConnection();
    const strainRepo = connection.getRepository(Strain);
    const strainTypeRepo = connection.getRepository(StrainType);
    return {strainRepo, strainTypeRepo};
};

export const createStrainType = async (requestBody: StrainTypeRequest, res: Response): Promise<StrainType | undefined> => {
    // get repo
    const {strainTypeRepo} = getRepos();

    // unique?
    if (!await doesNotConflict<StrainType>({
        repo: strainTypeRepo,
        properties: [
            {name: "name", value: requestBody.name}
        ],
        res: res
    })) {
        return undefined;
    }

    // save
    const strainType = new StrainType();
    strainType.name = requestBody.name;

    return await strainTypeRepo.save(strainType);
};

export const getStrainTypes = async (): Promise<StrainType[]> => {
    const {strainTypeRepo} = getRepos();
    return await strainTypeRepo.find();
}
