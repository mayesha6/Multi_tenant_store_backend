import Stripe from "stripe";
export declare const StripeWebhookServices: {
    handleCheckoutCompleted: (session: Stripe.Checkout.Session) => Promise<void>;
    handleSubscriptionUpdated: (subscription: Stripe.Subscription) => Promise<void>;
    handleSubscriptionDeleted: (subscription: Stripe.Subscription) => Promise<void>;
};
//# sourceMappingURL=webhook.services.d.ts.map