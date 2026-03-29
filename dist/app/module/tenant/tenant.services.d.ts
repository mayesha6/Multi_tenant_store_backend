export declare const TenantService: {
    createTenant: (payload: any) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        planId: string | null;
        stripeCustomerId: string | null;
        slug: string;
        subscriptionId: string | null;
    }>;
    getAllTenant: () => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        planId: string | null;
        stripeCustomerId: string | null;
        slug: string;
        subscriptionId: string | null;
    }[]>;
    getTenantById: (id: string) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        planId: string | null;
        stripeCustomerId: string | null;
        slug: string;
        subscriptionId: string | null;
    } | null>;
    updateTenant: (id: string, payload: any) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        planId: string | null;
        stripeCustomerId: string | null;
        slug: string;
        subscriptionId: string | null;
    }>;
    deleteTenant: (id: string) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        planId: string | null;
        stripeCustomerId: string | null;
        slug: string;
        subscriptionId: string | null;
    }>;
};
//# sourceMappingURL=tenant.services.d.ts.map