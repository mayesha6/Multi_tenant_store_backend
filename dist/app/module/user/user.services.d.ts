import type { JwtPayload } from "jsonwebtoken";
import type { IUser } from "./user.interface";
export declare const UserServices: {
    createUser: (payload: IUser) => Promise<{
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
    getAllUsers: (query: Record<string, string>, currentUser: JwtPayload) => Promise<{
        data: {
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
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
    }>;
    getMe: (userId: string) => Promise<{
        data: {
            email: string;
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
        };
    }>;
    getSingleUser: (id: string, currentUser: JwtPayload) => Promise<{
        data: {
            email: string;
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
        };
    }>;
    updateUser: (userId: string, payload: any, decodedToken: JwtPayload) => Promise<{
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
    updateMyProfile: (userId: string, payload: any, decodedToken: JwtPayload, file?: Express.Multer.File) => Promise<{
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
    deleteUserById: (userId: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=user.services.d.ts.map