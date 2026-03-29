import type { IPlan } from "./plan.interface";
export declare const PlanServices: {
    createPlan: (payload: IPlan) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        currency: string;
        interval: import("@prisma/client").$Enums.Interval;
        features: import("@prisma/client/runtime/client").JsonValue;
        stripeProductId: string;
        stripePriceId: string;
    }>;
    getAllPlans: () => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        currency: string;
        interval: import("@prisma/client").$Enums.Interval;
        features: import("@prisma/client/runtime/client").JsonValue;
        stripeProductId: string;
        stripePriceId: string;
    }[]>;
    getPlanById: (id: string) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        currency: string;
        interval: import("@prisma/client").$Enums.Interval;
        features: import("@prisma/client/runtime/client").JsonValue;
        stripeProductId: string;
        stripePriceId: string;
    }>;
    updatePlan: (id: string, payload: Partial<IPlan>) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        currency: string;
        interval: import("@prisma/client").$Enums.Interval;
        features: import("@prisma/client/runtime/client").JsonValue;
        stripeProductId: string;
        stripePriceId: string;
    }>;
    deletePlan: (id: string) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        currency: string;
        interval: import("@prisma/client").$Enums.Interval;
        features: import("@prisma/client/runtime/client").JsonValue;
        stripeProductId: string;
        stripePriceId: string;
    }>;
};
//# sourceMappingURL=plan.services.d.ts.map