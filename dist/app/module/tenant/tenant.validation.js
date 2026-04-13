import { z } from "zod";
// FIX: this matches the Figma workspace page
export const createTenantZodSchema = z.object({
    name: z.string().min(2, "Company name is required"),
    slug: z.string().min(2, "Slug is required"),
    industry: z.string().optional(),
    teamSize: z.string().optional(),
    websiteUrl: z.string().url().optional(),
});
export const updateTenantZodSchema = z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    industry: z.string().optional(),
    teamSize: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    onboardingStep: z.number().int().min(1).max(6).optional(),
    onboardingCompleted: z.boolean().optional(),
    isActive: z.boolean().optional(),
});
//# sourceMappingURL=tenant.validation.js.map