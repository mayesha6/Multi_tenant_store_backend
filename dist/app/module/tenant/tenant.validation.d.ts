import { z } from "zod";
export declare const tenantSchema: z.ZodObject<{
    name: z.ZodString;
    plan: z.ZodEnum<{
        [x: string]: string;
    }>;
}, z.core.$strip>;
//# sourceMappingURL=tenant.validation.d.ts.map