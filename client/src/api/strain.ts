import axios from "axios";
import {StrainRecord, StrainTypeRecord} from "../data/strain";

const baseUrl = "/api/strains";

export const getStrainTypes = async (): Promise<StrainTypeRecord[]> => {
    const response = await axios.get(`${baseUrl}/strain-type`);
    return response.data;
}

export const getStrains = async (): Promise<StrainRecord[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
}
