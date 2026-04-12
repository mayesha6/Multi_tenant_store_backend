// file: src/app/modules/webhook/messageWebhook.verify.ts

import crypto from "crypto";
import { envVars } from "../../config/env";

/**
 * Production safe verifier
 */
export const verifyWebhookSignature = (
  rawBody: string,
  signature: string | undefined,
  secret: string
) => {
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  // length mismatch crash prevent
  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
};

/**
 * MAIN verifier
 */
export const verifyIncomingMessageWebhook = (
  rawBody: string,
  signature?: string
) => {
  /**
   * 🔥 CHANGE:
   * development mode-এ verification bypass করছি
   */
  if (envVars.NODE_ENV === "development") {
    console.log("⚠️ Webhook signature bypassed (DEV MODE)");
    return true;
  }

  const secret = envVars.MESSAGE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("MESSAGE_WEBHOOK_SECRET is missing in env");
  }

  return verifyWebhookSignature(rawBody, signature, secret);
};