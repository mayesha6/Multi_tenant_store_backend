import { ContactSource, ContactStatus } from "@prisma/client";
import { z } from "zod";

// Reusable helper for tags from form/json input
const tagsSchema = z
  .union([
    z.array(z.string()),
    z.string(),
  ])
  .optional()
  .transform((value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.map((tag) => tag.trim()).filter(Boolean);
    }

    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  });

export const createContactZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." }),

  email: z
    .string()
    .email({ message: "Invalid email format." })
    .optional(),

  phone: z
    .string()
    .min(6, { message: "Phone number is too short." })
    .max(20, { message: "Phone number is too long." })
    .optional(),

  picture: z.string().url({ message: "Picture must be a valid URL." }).optional(),

  address: z
    .string()
    .max(255, { message: "Address cannot exceed 255 characters." })
    .optional(),

  status: z
    .enum(Object.values(ContactStatus) as [string, ...string[]])
    .optional(),

  source: z
    .enum(Object.values(ContactSource) as [string, ...string[]])
    .optional(),

  tags: tagsSchema,

  metadata: z.any().optional(),
})
.refine((data) => data.email || data.phone, {
  message: "At least email or phone is required.",
  path: ["email"],
});

export const updateContactZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." })
    .optional(),

  email: z
    .string()
    .email({ message: "Invalid email format." })
    .optional(),

  phone: z
    .string()
    .min(6, { message: "Phone number is too short." })
    .max(20, { message: "Phone number is too long." })
    .optional(),

  picture: z.string().url({ message: "Picture must be a valid URL." }).optional(),

  address: z
    .string()
    .max(255, { message: "Address cannot exceed 255 characters." })
    .optional(),

  status: z
    .enum(Object.values(ContactStatus) as [string, ...string[]])
    .optional(),

  source: z
    .enum(Object.values(ContactSource) as [string, ...string[]])
    .optional(),

  tags: tagsSchema,

  metadata: z.any().optional(),

  isDeleted: z.boolean().optional(),
});