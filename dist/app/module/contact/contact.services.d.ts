export declare const ContactService: {
    createContact: (payload: any) => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
    }>;
    getContacts: () => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
    }[]>;
    getContactById: (id: string) => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
    }>;
    updateContact: (id: string, payload: any) => Promise<{
        email: string;
        id: string;
        name: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        subject: string;
    }>;
    deleteContact: (id: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=contact.services.d.ts.map