import { z } from "zod";
// Create Contact
export const createContactZodSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
    email: z.string().email({ message: "Invalid email format." }),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
    message: z.string().min(5, { message: "Message must be at least 5 characters." }),
});
// Update Contact
export const updateContactZodSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Invalid Bangladeshi phone number." })
        .optional(),
    subject: z.string().min(3).optional(),
    message: z.string().min(5).optional(),
    isActive: z.boolean().optional(),
});
//# sourceMappingURL=contact.validation.js.map