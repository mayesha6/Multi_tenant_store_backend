import { envVars } from "./app/config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {} from "express";
import expressSession from "express-session";
import passport from "passport";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import { stripeWebhook } from "./app/module/webhook/webhook.controller";
import { MessageWebhookController } from "./app/module/messageWebhook/messageWebhook.controller";
const app = express();
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
app.use("/api/v1/webhooks/incoming-message", express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}), MessageWebhookController.receiveIncomingMessageWebhook);
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}));
app.use("/api/v1", router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to System Name Backend"
    });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
//# sourceMappingURL=app.js.map