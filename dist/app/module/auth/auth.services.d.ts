import type { JwtPayload } from "jsonwebtoken";
export declare const AuthServices: {
    getNewAccessToken: (refreshToken: string) => Promise<{
        accessToken: string;
    }>;
    changePassword: (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => Promise<void>;
    setPassword: (userId: string, plainPassword: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string, confirmPassword: string) => Promise<null>;
    resendSignupOtp: (email: string) => Promise<{
        message: string;
    }>;
    verifySignupOtp: (email: string, otp: string) => Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=auth.services.d.ts.map