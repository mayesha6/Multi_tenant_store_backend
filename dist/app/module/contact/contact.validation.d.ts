import { z } from "zod";
export declare const createContactZodSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    picture: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    tags: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodString]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const updateContactZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    picture: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    tags: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodString]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    metadata: z.ZodOptional<z.ZodAny>;
    isDeleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=contact.validation.d.ts.map