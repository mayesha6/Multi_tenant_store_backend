import type { Plan } from "@prisma/client";
export declare const updatePlan: (planId: string, payload: Partial<Plan>) => Promise<any>;
export declare const PlanServices: {
    createPlan: (payload: Plan) => Promise<any>;
    getAllPlans: () => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        planName: string;
        amount: number;
        currency: string | null;
        interval: import("@prisma/client").$Enums.Interval;
        intervalCount: number;
        freeTrialDays: number | null;
        productId: string | null;
        priceId: string | null;
        active: boolean;
        description: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    getPlanById: (planId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        planName: string;
        amount: number;
        currency: string | null;
        interval: import("@prisma/client").$Enums.Interval;
        intervalCount: number;
        freeTrialDays: number | null;
        productId: string | null;
        priceId: string | null;
        active: boolean;
        description: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    } | null>;
    deletePlan: (planId: string) => Promise<{
        message: string;
    }>;
    updatePlan: (planId: string, payload: Partial<Plan>) => Promise<any>;
};
//# sourceMappingURL=plan.services.d.ts.map