export declare const TenantService: {
    createTenant: (payload: any) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }>;
    getAllTenant: () => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }[]>;
    getTenantById: (id: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    } | null>;
    updateTenant: (id: string, payload: any) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }>;
    deleteTenant: (id: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }>;
};
//# sourceMappingURL=tenant.services.d.ts.map