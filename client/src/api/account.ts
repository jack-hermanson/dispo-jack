import {AccountAndPerson, LoginRequest} from "../data/account";
import axios from "axios";

const baseUrl = "/api/account";

export const logIn = async (userInfo: LoginRequest): Promise<AccountAndPerson> => {
    const response = await axios.post(`${baseUrl}/login`, userInfo);
    return response.data;
}

export const logOut = async (token: string): Promise<boolean> => {
    const response = await axios.post(`${baseUrl}/logout`, null, {
        headers: {
            Authentication: `Bearer ${token}`
        }
    });
    if (response.status === 200) return true;
    console.error(response);
    return false;
}
