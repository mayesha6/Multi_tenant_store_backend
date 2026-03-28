import { z } from "zod";
export declare const planValidationSchema: z.ZodObject<{
    planName: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodString>;
    interval: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    intervalCount: z.ZodOptional<z.ZodNumber>;
    freeTrialDays: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
//# sourceMappingURL=plan.validation.d.ts.map