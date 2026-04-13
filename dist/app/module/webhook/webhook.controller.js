import { envVars } from "../../config/env";
import { stripe } from "../../lib/stripe";
import { StripeWebhookService } from "./webhook.services";
export const stripeWebhook = async (req, res, next) => {
    try {
        const sig = req.headers["stripe-signature"];
        if (!sig) {
            return res.status(400).json({
                success: false,
                message: "Missing stripe-signature header",
            });
        }
        const event = stripe.webhooks.constructEvent(req.body, sig, envVars.STRIPE_WEBHOOK_SECRET);
        await StripeWebhookService.handleEvent(event);
        return res.status(200).json({ received: true });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: `Webhook Error: ${error.message}`,
        });
    }
};
//# sourceMappingURL=webhook.controller.js.map