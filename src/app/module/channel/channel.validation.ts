// channel.ts
import { z } from "zod";
import { ChannelType } from "../../utils/enums";

export const channelSchema = z.object({
  tenantId: z.string(),
  type: z.enum(Object.values(ChannelType) as [string, ...string[]]),
  apiKey: z.string(),
  settings: z.any().optional(),
});

export type ChannelInput = z.infer<typeof channelSchema>;