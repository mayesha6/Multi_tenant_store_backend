// channel.ts
import { z } from "zod";
import { ChannelType } from "../../utils/enums";
export const channelSchema = z.object({
    tenantId: z.string(),
    type: z.enum(Object.values(ChannelType)),
    apiKey: z.string(),
    settings: z.any().optional(),
});
//# sourceMappingURL=channel.validation.js.map