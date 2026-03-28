export declare const ContactService: {
    createContact: (payload: any) => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
        tags: string[];
    }>;
    getContacts: () => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
        tags: string[];
    }[]>;
    getContactById: (id: string) => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
        tags: string[];
    }>;
    updateContact: (id: string, payload: any) => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
        tags: string[];
    }>;
    deleteContact: (id: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=contact.services.d.ts.map