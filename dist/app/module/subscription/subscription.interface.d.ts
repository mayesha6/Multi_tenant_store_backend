import { SubscriptionStatus } from "@prisma/client";
export interface ISubscription {
    id?: string;
    tenantId: string;
    planId: string;
    stripeSubId: string;
    status?: SubscriptionStatus;
    stripeCustomerId: string;
    startDate: Date;
    endDate: Date;
    intervalCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=subscription.interface.d.ts.map