import type { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import { stripe } from "../../lib/stripe";
import { StripeWebhookService } from "./webhook.services";
import type Stripe from "stripe";


// export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
//     const sig = req.headers["stripe-signature"] as string;
//     if (!sig) return res.status(400).send("Missing stripe-signature header");

//     let event: Stripe.Event;

//     try {
//         // Use raw body for signature verification
//         event = stripe.webhooks.constructEvent(
//             req.body, // ensure raw body middleware in express
//             sig,
//             envVars.STRIPE_WEBHOOK_SECRET
//         );
//     } catch (err: any) {
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     try {
//         switch (event.type) {
//             case "checkout.session.completed":
//                 await StripeWebhookServices.handleCheckoutCompleted(event.data.object as any);
//                 break;

//             case "customer.subscription.updated":
//                 await StripeWebhookServices.handleSubscriptionUpdated(event.data.object as any);
//                 break;

//             case "customer.subscription.deleted":
//                 await StripeWebhookServices.handleSubscriptionDeleted(event.data.object as any);
//                 break;

//             case "invoice.paid":
//                 await StripeWebhookServices.handleInvoicePaid(event.data.object as any);
//                 break;

//             case "invoice.payment_failed":
//                 await StripeWebhookServices.handlePaymentFailed(event.data.object as any);
//                 break;
//         }
//     } catch (error) {
//         console.error("Webhook processing error:", error);
//         return res.status(500).send("Webhook handler error");
//     }

//     res.status(200).json({ received: true });
// };

// export const StripeWebhookControllers = {
//     handleWebhook
// };

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string

    const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        envVars.STRIPE_WEBHOOK_SECRET
    )

    await StripeWebhookService.handleEvent(event)

    res.json({ received: true })
}