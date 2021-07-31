import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";
import { PersonRecord } from "../../../shared/resource_models/person";

const baseUrl = "/api/people";

export abstract class PersonClient {
    static async getPeople(token: string) {
        const response = await axios.get<PersonRecord[]>(
            baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getPeopleFilter(token: string, filterText: string) {
        const response = await axios.get<PersonRecord[]>(
            `${baseUrl}/filter?q=${filterText}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getPerson(token: string, id: number) {
        const response = await axios.get<PersonRecord>(
            `${baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }
}
