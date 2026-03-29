import { z } from "zod";
export declare const createPlanZodSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodOptional<z.ZodString>;
    interval: z.ZodEnum<{
        [x: string]: string;
    }>;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updatePlanZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodString>;
    interval: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=plan.validation.d.ts.map