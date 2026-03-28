import { z } from "zod";
const SubscriptionValidationSchema = z.object({
    planId: z.string(),
});
export const SubscriptionValidation = {
    SubscriptionValidationSchema,
};
//# sourceMappingURL=subscription.validation.js.map