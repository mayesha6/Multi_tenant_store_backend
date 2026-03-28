// enums.ts
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  VIEWER = "VIEWER",
}

export enum PlanType {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
}

export enum ChannelType {
  WHATSAPP = "WHATSAPP",
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  TELEGRAM = "TELEGRAM",
  EMAIL = "EMAIL",
  SMS = "SMS",
}

export enum ConversationStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  PENDING = "PENDING",
}

export enum SenderType {
  CUSTOMER = "CUSTOMER",
  AGENT = "AGENT",
  AI = "AI",
}

export enum KBType {
  PDF = "PDF",
  TEXT = "TEXT",
  FAQ = "FAQ",
  URL = "URL",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}