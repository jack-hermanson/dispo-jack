import {
    AccountAndPerson,
    LoginRequest,
    RegisterRequest,
    TokenLoginRequest,
} from "../../../shared/resource_models/account";
import axios from "axios";

const baseUrl = "/clients/account";

export abstract class AccountClient {
    static async logIn(userInfo: LoginRequest): Promise<AccountAndPerson> {
        const response = await axios.post(`${baseUrl}/login`, userInfo);
        return response.data;
    }

    static async logOut(token: string): Promise<boolean> {
        const response = await axios.post(`${baseUrl}/logout`, null, {
            headers: {
                Authentication: `Bearer ${token}`,
            },
        });
        if (response.status === 200) return true;
        console.error(response);
        return false;
    }

    static async tokenLogin(token: string) {
        const requestBody: TokenLoginRequest = { token };
        const response = await axios.post<AccountAndPerson>(
            `${baseUrl}/token`,
            requestBody
        );
        return response.data;
    }

    static async register(registerRequest: RegisterRequest) {
        const response = await axios.post<AccountAndPerson>(
            `${baseUrl}/register`,
            registerRequest
        );
        return response.data;
    }
}
