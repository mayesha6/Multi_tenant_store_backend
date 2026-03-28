import { z } from "zod";
export const createFAQZodSchema = z.object({
    question: z
        .string()
        .min(5, { message: "Question must be at least 5 characters long." })
        .max(300, { message: "Question cannot exceed 300 characters." }),
    answer: z
        .string()
        .min(5, { message: "Answer must be at least 5 characters long." }),
    order: z
        .number({
        message: "Order must be a number.",
    })
        .int()
        .nonnegative()
        .optional(),
    isActive: z.boolean().optional(),
});
export const updateFAQZodSchema = z.object({
    question: z
        .string()
        .min(5, { message: "Question must be at least 5 characters long." })
        .max(300, { message: "Question cannot exceed 300 characters." })
        .optional(),
    answer: z
        .string()
        .min(5, { message: "Answer must be at least 5 characters long." })
        .optional(),
    order: z
        .number()
        .int()
        .nonnegative()
        .optional(),
    isActive: z.boolean().optional(),
});
//# sourceMappingURL=faq.validation.js.map