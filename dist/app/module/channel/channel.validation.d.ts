import { z } from "zod";
export declare const channelSchema: z.ZodObject<{
    tenantId: z.ZodString;
    type: z.ZodEnum<{
        [x: string]: string;
    }>;
    apiKey: z.ZodString;
    settings: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export type ChannelInput = z.infer<typeof channelSchema>;
//# sourceMappingURL=channel.validation.d.ts.map