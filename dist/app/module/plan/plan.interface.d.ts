import { Interval } from "@prisma/client";
export interface IPlan {
    id?: string;
    name: string;
    price: number;
    currency?: string;
    interval: Interval;
    features: string[];
    isActive?: boolean;
    stripeProductId: string;
    stripePriceId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=plan.interface.d.ts.map