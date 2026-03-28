/**
 * Create Access + Refresh Token
 */
export declare const createUserTokens: (user: {
    id: string;
    email: string;
    role: string;
}) => {
    accessToken: string;
    refreshToken: string;
};
/**
 * Generate New Access Token Using Refresh Token
 */
export declare const createNewAccessTokenWithRefreshToken: (refreshToken: string) => Promise<string>;
//# sourceMappingURL=userTokens.d.ts.map