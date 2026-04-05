import { ContactSource, ContactStatus } from "@prisma/client";
import { z } from "zod";

export const createContactZodSchema = z.object({
  tenantId: z.string().uuid({ message: "Valid tenantId is required." }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." }),
  email: z
    .string()
    .email({ message: "Invalid email address format." })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional()
    .or(z.literal("")),
  picture: z.string().url({ message: "Picture must be a valid URL." }).optional().or(z.literal("")),
  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  status: z.enum(Object.values(ContactStatus) as [string, ...string[]]).optional(),
  source: z.enum(Object.values(ContactSource) as [string, ...string[]]).optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
  metadata: z.any().optional(),
}).refine(
  (data) => !!data.email || !!data.phone,
  {
    message: "At least one of email or phone is required.",
    path: ["email"],
  }
);

export const updateContactZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email address format." })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional()
    .or(z.literal("")),
  picture: z.string().url({ message: "Picture must be a valid URL." }).optional().or(z.literal("")),
  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  status: z.enum(Object.values(ContactStatus) as [string, ...string[]]).optional(),
  source: z.enum(Object.values(ContactSource) as [string, ...string[]]).optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
  metadata: z.any().optional(),
  isDeleted: z.boolean().optional(),
});

export const contactQueryZodSchema = z.object({
  searchTerm: z.string().optional(),
  status: z.enum(Object.values(ContactStatus) as [string, ...string[]]).optional(),
  source: z.enum(Object.values(ContactSource) as [string, ...string[]]).optional(),
  tag: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});