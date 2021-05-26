import {getConnection, Repository} from "typeorm";
import {Strain, StrainRequest} from "../entities/Strain";
import {StrainType, StrainTypeRequest} from "../entities/StrainType";
import {Response} from "express";
import {doesNotConflict} from "../utils/validation";
import {HTTP_STATUS} from "../utils/constants";

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
};

export const createStrain = async (requestBody: StrainRequest, res: Response): Promise<Strain | undefined> => {
    const {strainRepo, strainTypeRepo} = getRepos();

    // unique?
    if (!await doesNotConflict({
        repo: strainRepo,
        properties: [
            {name: "name", value: requestBody.name}
        ],
        res: res
    })) {
        return undefined;
    }

    // is strainTypeId legit?
    const strainType = await strainTypeRepo.findOne({id: requestBody.strainTypeId});
    if (!strainType) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND);
        return undefined;
    }

    // create strain record
    const strain = new Strain();
    strain.name = requestBody.name;
    strain.strainTypeId = requestBody.strainTypeId;
    strain.ouncePrice = requestBody.ouncePrice;
    strain.quadPrice = requestBody.quadPrice;
    strain.eighthPrice = requestBody.eighthPrice;
    strain.gramPrice = requestBody.gramPrice;

    return await strainRepo.save(strain);
};

export const getStrains = async (): Promise<Strain[]> => {
    const {strainRepo} = await getRepos();
    return await strainRepo.find();
}