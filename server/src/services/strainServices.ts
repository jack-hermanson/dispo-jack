import { getConnection, Repository } from "typeorm";
import { Strain } from "../models/Strain";
import { StrainType } from "../models/StrainType";
import { StrainRequest } from "../../../shared/resource_models/strain";
import { StrainTypeRequest } from "../../../shared/resource_models/strainType";
import { Response } from "express";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";

const getRepos = (): {
    strainRepo: Repository<Strain>;
    strainTypeRepo: Repository<StrainType>;
} => {
    const connection = getConnection();
    const strainRepo = connection.getRepository(Strain);
    const strainTypeRepo = connection.getRepository(StrainType);
    return { strainRepo, strainTypeRepo };
};

export const createStrainType = async (
    requestBody: StrainTypeRequest,
    res: Response
): Promise<StrainType | undefined> => {
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
};

export const getStrainTypes = async (): Promise<StrainType[]> => {
    const { strainTypeRepo } = getRepos();
    return await strainTypeRepo.find();
};

export const createStrain = async (
    requestBody: StrainRequest,
    res: Response
): Promise<Strain | undefined> => {
    const { strainRepo, strainTypeRepo } = getRepos();

    // unique?
    if (
        !(await doesNotConflict({
            repo: strainRepo,
            properties: [{ name: "name", value: requestBody.name }],
            res: res,
        }))
    ) {
        return undefined;
    }

    // is strainTypeId legit?
    const strainType = await strainTypeRepo.findOne({
        id: requestBody.strainTypeId,
    });
    if (!strainType) {
        res.sendStatus(HTTP.NOT_FOUND);
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
    const { strainRepo } = await getRepos();
    return await strainRepo.find();
};

export const getOneStrain = async (
    strainId: number,
    res: Response
): Promise<Strain | undefined> => {
    const { strainRepo } = getRepos();

    const strain = await strainRepo.findOne({ id: strainId });
    if (!strain) {
        res.sendStatus(HTTP.NOT_FOUND);
        return undefined;
    }
    return strain;
};

export const editStrain = async (
    strainId: number,
    requestBody: StrainRequest,
    res: Response
): Promise<Strain | undefined> => {
    const { strainRepo } = getRepos();

    // get the strain to edit
    const strain = await getOneStrain(strainId, res);
    if (!strain) return undefined;

    // check for conflicts
    if (
        !(await doesNotConflict({
            repo: strainRepo,
            properties: [{ name: "name", value: requestBody.name }],
            res: res,
            existingRecord: strain,
        }))
    )
        return undefined;

    // save edits
    await strainRepo.update(strain, requestBody);

    return await getOneStrain(strainId, res);
};
