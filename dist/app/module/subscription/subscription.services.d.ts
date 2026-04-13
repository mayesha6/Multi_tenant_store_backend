export declare const SubscriptionServices: {
    getAllSubscriptions: (currentUser: any) => Promise<({
        tenant: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            stripeCustomerId: string | null;
            slug: string;
            industry: string | null;
            teamSize: string | null;
            websiteUrl: string | null;
            onboardingStep: number;
            onboardingCompleted: boolean;
            currentPlanId: string | null;
            currentSubId: string | null;
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
    })[]>;
    createCheckoutSession: (currentUser: any, planId: string) => Promise<{
        url: string | null;
    }>;
};
//# sourceMappingURL=subscription.services.d.ts.map