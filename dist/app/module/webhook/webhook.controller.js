import { envVars } from "../../config/env";
import { stripe } from "../../lib/stripe";
import { StripeWebhookServices } from "./webhook.services";
const handleWebhook = async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, envVars.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case "checkout.session.completed":
            await StripeWebhookServices.handleCheckoutCompleted(event.data.object);
            break;
        case "customer.subscription.updated":
            await StripeWebhookServices.handleSubscriptionUpdated(event.data.object);
            break;
        case "customer.subscription.deleted":
            await StripeWebhookServices.handleSubscriptionDeleted(event.data.object);
            break;
    }
    res.json({ received: true });
};
export const StripeWebhookControllers = {
    handleWebhook
};
//# sourceMappingURL=webhook.controller.js.map