import { z } from "zod";
export declare const sendMessageZodSchema: z.ZodObject<{
    content: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
//# sourceMappingURL=message.validation.d.ts.map