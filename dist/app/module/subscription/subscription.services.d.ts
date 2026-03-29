import type { ISubscription } from "./subscription.interface";
export declare const SubscriptionServices: {
    createSubscription: (payload: ISubscription) => Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        stripeSubId: string;
        stripeCustomerId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        intervalCount: number;
    }>;
    getSubscriptionById: (id: string) => Promise<{
        tenant: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            planId: string | null;
            stripeCustomerId: string | null;
            slug: string;
            subscriptionId: string | null;
        };
        plan: {
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
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        stripeSubId: string;
        stripeCustomerId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        intervalCount: number;
    }>;
    getAllSubscriptions: () => Promise<({
        tenant: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            planId: string | null;
            stripeCustomerId: string | null;
            slug: string;
            subscriptionId: string | null;
        };
        plan: {
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
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        stripeSubId: string;
        stripeCustomerId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        intervalCount: number;
    })[]>;
    updateSubscription: (id: string, payload: Partial<ISubscription>) => Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        stripeSubId: string;
        stripeCustomerId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        intervalCount: number;
    }>;
    cancelSubscription: (id: string) => Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        stripeSubId: string;
        stripeCustomerId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        intervalCount: number;
    }>;
};
//# sourceMappingURL=subscription.services.d.ts.map