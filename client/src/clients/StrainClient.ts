import axios from "axios";
import {
    StrainRecord,
    StrainRequest,
} from "../../../shared/resource_models/strain";
import { StrainTypeRecord } from "../../../shared/resource_models/strainType";

const baseUrl = "/clients/strains";

export abstract class StrainClient {
    static async getStrainTypes(): Promise<StrainTypeRecord[]> {
        const response = await axios.get(`${baseUrl}/strain-type`);
        return response.data;
    }

    static async getStrains(): Promise<StrainRecord[]> {
        const response = await axios.get(baseUrl);
        return response.data;
    }

    static async addStrain(strain: StrainRequest, token: string) {
        const response = await axios.post(baseUrl, strain, {
            headers: {
                Authentication: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    static async editStrain(
        strainId: number,
        strain: StrainRequest,
        token: string
    ): Promise<StrainRecord> {
        const response = await axios.put(`${baseUrl}/${strainId}`, strain, {
            headers: {
                Authentication: `Bearer ${token}`,
            },
        });
        return response.data;
    }
}
