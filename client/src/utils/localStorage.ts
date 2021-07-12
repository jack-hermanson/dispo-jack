export abstract class LocalStorage {
    static keyName = "token";

    static saveToken(token: string): void {
        localStorage.setItem(this.keyName, token);
    }

    static getToken(): string | undefined {
        return localStorage.getItem(this.keyName) || undefined;
    }

    static removeToken(): void {
        localStorage.removeItem(this.keyName);
    }
}
