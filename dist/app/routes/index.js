import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.routes";
import { UserRoutes } from "../module/user/user.routes";
import { OtpRoutes } from "../module/otp/otp.routes";
import { ContentRoutes } from "../module/content/content.routes";
import { FAQRoutes } from "../module/faq/faq.routes";
import { ContactRoutes } from "../module/contact/contact.routes";
import { PlanRoutes } from "../module/plan/plan.routes";
import { SubscriptionRoutes } from "../module/subscription/subscription.routes";
import { TenantRoutes } from "../module/tenant/tenant.routes";
import { ConversationRoutes } from "../module/conversation/conversation.routes";
export const router = Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/otp",
        route: OtpRoutes
    },
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/content",
        route: ContentRoutes
    },
    {
        path: "/faq",
        route: FAQRoutes
    },
    {
        path: "/contact",
        route: ContactRoutes
    },
    {
        path: "/plan",
        route: PlanRoutes
    },
    {
        path: "/subscription",
        route: SubscriptionRoutes
    },
    {
        path: "/tenant",
        route: TenantRoutes
    },
    {
        path: "/conversations",
        route: ConversationRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
//# sourceMappingURL=index.js.map