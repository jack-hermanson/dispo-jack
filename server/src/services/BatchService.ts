import { getConnection, Repository } from "typeorm";
import { Response } from "express";
import { Batch } from "../models/Batch";
import { getOneStrain } from "./strainServices";
import { BatchRequest } from "../../../shared/resource_models/batch";
import { HTTP } from "jack-hermanson-ts-utils";

const getRepos = (): {
    batchRepo: Repository<Batch>;
} => {
    const connection = getConnection();
    const batchRepo = connection.getRepository(Batch);
    return { batchRepo };
};

export abstract class BatchService {
    static async getAll(): Promise<Batch[]> {
        const { batchRepo } = getRepos();
        return await batchRepo.find();
    }

    static async create(
        requestBody: BatchRequest,
        res: Response
    ): Promise<Batch | undefined> {
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
        batch.dateReceived = requestBody.dateReceived;

        return await batchRepo.save(batch);
    }

    static async getOne(id: number, res: Response): Promise<Batch | undefined> {
        const { batchRepo } = getRepos();
        const batch = await batchRepo.findOne(id);
        if (!batch) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return batch;
    }

    static async delete(
        id: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { batchRepo } = getRepos();

        const batch = await this.getOne(id, res);
        if (!batch) {
            return undefined;
        }

        await batchRepo.remove(batch);
        return true;
    }
}
