import Stripe from "stripe";
declare const handlePaymentIntentSucceeded: (paymentIntent: Stripe.PaymentIntent) => Promise<void>;
declare const handlePaymentIntentFailed: (paymentIntent: Stripe.PaymentIntent) => Promise<void>;
export { handlePaymentIntentSucceeded, handlePaymentIntentFailed };
//# sourceMappingURL=webhook.d.ts.map