import type { JwtPayload } from "jsonwebtoken";
interface ISignupPayload {
    email: string;
    otp: string;
}
export declare const AuthServices: {
    getNewAccessToken: (refreshToken: string) => Promise<{
        accessToken: string;
    }>;
    changePassword: (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => Promise<void>;
    setPassword: (userId: string, plainPassword: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<{
        message: string;
    }>;
    sendSignupOtp: (email: string, name: string) => Promise<{
        message: string;
    }>;
    verifySignupOtp: (payload: ISignupPayload) => Promise<{
        message: string;
        user: {
            email: string;
            password: string | null;
            id: string;
            name: string;
            phone: string | null;
            picture: string | null;
            address: string | null;
            tenantId: string | null;
            isDeleted: boolean;
            isActive: import("@prisma/client").$Enums.IsActive;
            isVerified: boolean;
            role: import("@prisma/client").$Enums.UserRole;
            isSubscribed: boolean;
            planExpiration: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
};
export {};
//# sourceMappingURL=auth.services.d.ts.map