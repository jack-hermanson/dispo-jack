import axios from "axios";
import {
    StrainRecord,
    StrainRequest,
} from "../../../shared/resource_models/strain";
import { StrainTypeRecord } from "../../../shared/resource_models/strainType";

const baseUrl = "/api/strains";

export const getStrainTypes = async (): Promise<StrainTypeRecord[]> => {
    const response = await axios.get(`${baseUrl}/strain-type`);
    return response.data;
};

export const getStrains = async (): Promise<StrainRecord[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
};

export const addStrain = async (strain: StrainRequest, token: string) => {
    const response = await axios.post(baseUrl, strain, {
        headers: {
            Authentication: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const editStrain = async (
    strainId: number,
    strain: StrainRequest,
    token: string
): Promise<StrainRecord> => {
    const response = await axios.put(`${baseUrl}/${strainId}`, strain, {
        headers: {
            Authentication: `Bearer ${token}`,
        },
    });
    return response.data;
};
