import { getConnection, Repository } from "typeorm";
import { Response } from "express";
import { Batch, BatchRequest } from "../entities/Batch";
import { getOneStrain } from "./strainServices";

const getRepos = (): {
    batchRepo: Repository<Batch>;
} => {
    const connection = getConnection();
    const batchRepo = connection.getRepository(Batch);
    return { batchRepo };
};

export const getBatches = async (): Promise<Batch[]> => {
    const { batchRepo } = getRepos();
    return await batchRepo.find();
};

export const createBatch = async (
    requestBody: BatchRequest,
    res: Response
): Promise<Batch | undefined> => {
    // get repo
    const { batchRepo } = getRepos();

    // is strainId legit?
    const strain = await getOneStrain(requestBody.strainId, res);
    if (!strain) return undefined;

    // create new record
    const batch = new Batch();
    batch.strainId = strain.id;
    batch.size = requestBody.size;
    batch.thcPotency = requestBody.thcPotency;
    batch.cbdPotency = requestBody.cbdPotency;
    batch.notes = requestBody.notes;
    batch.imageUrl = requestBody.imageUrl;

    return await batchRepo.save(batch);
};
