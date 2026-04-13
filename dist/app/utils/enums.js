// enums.ts
export var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["OWNER"] = "OWNER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["AGENT"] = "AGENT";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (UserRole = {}));
export var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "FREE";
    PlanType["PRO"] = "PRO";
    PlanType["ENTERPRISE"] = "ENTERPRISE";
})(PlanType || (PlanType = {}));
// export enum SubscriptionStatus {
//   ACTIVE = "ACTIVE",
//   INACTIVE = "INACTIVE",
//   TRIALING = "TRIALING",
//   CANCELLED = "CANCELLED",
// }
export var ChannelType;
(function (ChannelType) {
    ChannelType["WHATSAPP"] = "WHATSAPP";
    ChannelType["INSTAGRAM"] = "INSTAGRAM";
    ChannelType["FACEBOOK"] = "FACEBOOK";
    ChannelType["TELEGRAM"] = "TELEGRAM";
    ChannelType["EMAIL"] = "EMAIL";
    ChannelType["SMS"] = "SMS";
})(ChannelType || (ChannelType = {}));
export var ConversationStatus;
(function (ConversationStatus) {
    ConversationStatus["OPEN"] = "OPEN";
    ConversationStatus["CLOSED"] = "CLOSED";
    ConversationStatus["PENDING"] = "PENDING";
})(ConversationStatus || (ConversationStatus = {}));
export var SenderType;
(function (SenderType) {
    SenderType["CUSTOMER"] = "CUSTOMER";
    SenderType["AGENT"] = "AGENT";
    SenderType["AI"] = "AI";
})(SenderType || (SenderType = {}));
export var KBType;
(function (KBType) {
    KBType["PDF"] = "PDF";
    KBType["TEXT"] = "TEXT";
    KBType["FAQ"] = "FAQ";
    KBType["URL"] = "URL";
})(KBType || (KBType = {}));
export var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (IsActive = {}));
//# sourceMappingURL=enums.js.map