import { z } from "zod";
export declare const kbSchema: z.ZodObject<{
    tenantId: z.ZodString;
    title: z.ZodString;
    type: z.ZodEnum<{
        [x: string]: string;
    }>;
    content: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type KBInput = z.infer<typeof kbSchema>;
//# sourceMappingURL=knowledgeBase.validation.d.ts.map