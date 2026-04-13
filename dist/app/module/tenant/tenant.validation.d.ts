import { z } from "zod";
export declare const createTenantZodSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    industry: z.ZodOptional<z.ZodString>;
    teamSize: z.ZodOptional<z.ZodString>;
    websiteUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTenantZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    teamSize: z.ZodOptional<z.ZodString>;
    websiteUrl: z.ZodOptional<z.ZodString>;
    onboardingStep: z.ZodOptional<z.ZodNumber>;
    onboardingCompleted: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=tenant.validation.d.ts.map