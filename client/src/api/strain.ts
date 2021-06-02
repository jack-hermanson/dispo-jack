import axios from "axios";
import {StrainRecord, StrainRequest, StrainTypeRecord} from "../data/strain";

const baseUrl = "/api/strains";

export const getStrainTypes = async (): Promise<StrainTypeRecord[]> => {
    const response = await axios.get(`${baseUrl}/strain-type`);
    return response.data;
}

export const getStrains = async (): Promise<StrainRecord[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
}

export const addStrain = async (strain: StrainRequest, token: string) => {
    await axios.post(baseUrl, strain, {
        headers: {
            Authentication: `Bearer ${token}`
        }
    });
}

export const editStrain = async (strainId: number, strain: StrainRequest, token: string): Promise<StrainRecord> => {
    return await axios.put(`${baseUrl}/${strainId}`, strain, {
        headers: {
            Authentication: `Bearer ${token}`
        }
    });
}
