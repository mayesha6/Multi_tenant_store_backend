import { ContactSource } from "@prisma/client";
interface IFindOrCreateContactFromWebhookPayload {
    tenantId: string;
    name?: string;
    email?: string;
    phone?: string;
    source?: ContactSource | any;
}
/**
 * webhook থেকে contact resolve/create
 * priority:
 * 1. phone match
 * 2. email match
 * 3. new contact create
 */
export declare const findOrCreateContactFromWebhook: (payload: IFindOrCreateContactFromWebhookPayload) => Promise<{
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
    metadata: import("@prisma/client/runtime/client").JsonValue | null;
    source: import("@prisma/client").$Enums.ContactSource;
    tags: string[];
}>;
export {};
//# sourceMappingURL=contact.d.ts.map