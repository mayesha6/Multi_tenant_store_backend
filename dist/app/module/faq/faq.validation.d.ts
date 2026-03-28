import { z } from "zod";
export declare const createFAQZodSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
    order: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateFAQZodSchema: z.ZodObject<{
    question: z.ZodOptional<z.ZodString>;
    answer: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=faq.validation.d.ts.map