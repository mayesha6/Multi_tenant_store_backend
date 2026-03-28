import Stripe from "stripe";
import type { Prisma, Subscription } from "@prisma/client";
export declare const SubscriptionServices: {
    getMySubscription: (userId: string) => Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            picture: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            isSubscribed: boolean;
            planExpiration: Date | null;
        };
        plan: {
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
            features: Prisma.JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        description: string | null;
        planId: string;
        startDate: Date;
        endDate: Date | null;
        stripePaymentId: string;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        benefitsIncluded: string | null;
    }>;
    createSubscription: (userId: string, planId: string) => Promise<{
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            amount: number;
            description: string | null;
            planId: string;
            startDate: Date;
            endDate: Date | null;
            stripePaymentId: string;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            benefitsIncluded: string | null;
        };
        clientSecret: string | null;
        paymentIntentId: string;
        planType: string;
    }>;
    getAllSubscription: (query: Record<string, any>) => Promise<{
        data: {
            email: string;
            password: string | null;
            id: string;
            name: string;
            phone: string | null;
            picture: string | null;
            address: string | null;
            isDeleted: boolean;
            isActive: import("@prisma/client").$Enums.IsActive;
            isVerified: boolean;
            role: import("@prisma/client").$Enums.UserRole;
            isSubscribed: boolean;
            planExpiration: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
    }>;
    updateSubscription: (subscriptionId: string, data: Subscription) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        description: string | null;
        planId: string;
        startDate: Date;
        endDate: Date | null;
        stripePaymentId: string;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        benefitsIncluded: string | null;
    }>;
    deleteSubscription: (subscriptionId: string) => Promise<null>;
    HandleStripeWebhook: (event: Stripe.Event) => Promise<{
        received: boolean;
    }>;
    getSingleSubscription: (subscriptionId: string) => Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            picture: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            isSubscribed: boolean;
            planExpiration: Date | null;
        };
        plan: {
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
            features: Prisma.JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        description: string | null;
        planId: string;
        startDate: Date;
        endDate: Date | null;
        stripePaymentId: string;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        benefitsIncluded: string | null;
    }>;
};
//# sourceMappingURL=subscription.services.d.ts.map