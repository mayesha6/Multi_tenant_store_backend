import type { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import { stripe } from "../../lib/stripe";
import { StripeWebhookServices } from "./webhook.services";


const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        envVars.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        await StripeWebhookServices.handleCheckoutCompleted(
          event.data.object as any
        );
        break;

      case "customer.subscription.updated":
        await StripeWebhookServices.handleSubscriptionUpdated(
          event.data.object as any
        );
        break;

      case "customer.subscription.deleted":
        await StripeWebhookServices.handleSubscriptionDeleted(
          event.data.object as any
        );
        break;
    }

    res.json({ received: true });
  }

export const StripeWebhookControllers = {
    handleWebhook
};