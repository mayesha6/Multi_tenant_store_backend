export declare const ContentService: {
    getContentByType: (type: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        content: string;
        order: number;
        isPublished: boolean;
    }[]>;
    getAllContents: () => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        content: string;
        order: number;
        isPublished: boolean;
    }[]>;
    createContent: (type: string, payload: any) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        content: string;
        order: number;
        isPublished: boolean;
    }>;
    updateContent: (type: string, id: string, payload: any) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        content: string;
        order: number;
        isPublished: boolean;
    }>;
    deleteContent: (type: string, id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        type: import("@prisma/client").$Enums.ContentType;
        title: string;
        content: string;
        order: number;
        isPublished: boolean;
    }>;
};
//# sourceMappingURL=content.services.d.ts.map