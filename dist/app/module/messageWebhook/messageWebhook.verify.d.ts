/**
 * Production safe verifier
 */
export declare const verifyWebhookSignature: (rawBody: string, signature: string | undefined, secret: string) => boolean;
/**
 * MAIN verifier
 */
export declare const verifyIncomingMessageWebhook: (rawBody: string, signature?: string) => boolean;
//# sourceMappingURL=messageWebhook.verify.d.ts.map