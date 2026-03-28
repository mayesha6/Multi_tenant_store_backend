export declare const FAQService: {
    createFAQ: (payload: any) => Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number | null;
        question: string;
        answer: string;
    }>;
    getAllFAQ: () => Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number | null;
        question: string;
        answer: string;
    }[]>;
    getSingleFAQ: (id: string) => Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number | null;
        question: string;
        answer: string;
    } | null>;
    updateFAQ: (id: string, payload: any) => Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number | null;
        question: string;
        answer: string;
    }>;
    deleteFAQ: (id: string) => Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number | null;
        question: string;
        answer: string;
    }>;
};
//# sourceMappingURL=faq.services.d.ts.map