import type { UserInfoType } from "../types/user-info.type";
export declare class Auth {
    static accessTokenKey: string;
    private static refreshTokenKey;
    private static userInfoKey;
    static processUnauthorizedResponse(): Promise<boolean>;
    static logout(): Promise<boolean>;
    static setTokens(accessToken: string, refreshToken: string): void;
    private static removeTokens;
    static setUserInfo(info: UserInfoType): void;
    static getUserInfo(): UserInfoType | null;
}
//# sourceMappingURL=auth.d.ts.map