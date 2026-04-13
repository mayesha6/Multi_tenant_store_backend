import type { JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import type { IContact } from "./constact.interface";
export declare const ContactServices: {
    createContact: (currentUser: JwtPayload, payload: IContact) => Promise<{
        email: string | null;
        id: string;
        name: string;
        phone: string | null;
        picture: string | null;
        address: string | null;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContactStatus;
        metadata: Prisma.JsonValue | null;
        source: import("@prisma/client").$Enums.ContactSource;
        tags: string[];
    }>;
    getAllContacts: (currentUser: JwtPayload, query: Record<string, string>) => Promise<{
        data: {
            email: string | null;
            id: string;
            name: string;
            phone: string | null;
            picture: string | null;
            address: string | null;
            tenantId: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ContactStatus;
            metadata: Prisma.JsonValue | null;
            source: import("@prisma/client").$Enums.ContactSource;
            tags: string[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
    }>;
    getSingleContact: (currentUser: JwtPayload, contactId: string) => Promise<{
        _count: {
            conversations: number;
        };
    } & {
        email: string | null;
        id: string;
        name: string;
        phone: string | null;
        picture: string | null;
        address: string | null;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContactStatus;
        metadata: Prisma.JsonValue | null;
        source: import("@prisma/client").$Enums.ContactSource;
        tags: string[];
    }>;
    updateContact: (currentUser: JwtPayload, contactId: string, payload: Partial<IContact>) => Promise<{
        email: string | null;
        id: string;
        name: string;
        phone: string | null;
        picture: string | null;
        address: string | null;
        tenantId: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContactStatus;
        metadata: Prisma.JsonValue | null;
        source: import("@prisma/client").$Enums.ContactSource;
        tags: string[];
    }>;
    deleteContact: (currentUser: JwtPayload, contactId: string) => Promise<null>;
};
//# sourceMappingURL=contact.services.d.ts.map