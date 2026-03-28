import { type NextFunction, type Request, type Response, Router } from "express";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { AuthControllers } from "./auth.controller";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/change-password", checkAuth(...Object.values(UserRole)), AuthControllers.changePassword)
router.post("/set-password", checkAuth(...Object.values(UserRole)), AuthControllers.setPassword)
router.post("/forgot-password", AuthControllers.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(UserRole)), AuthControllers.resetPassword)

router.post("/signup/send-otp", AuthControllers.sendSignupOtp);
router.post("/signup/verify-otp", AuthControllers.verifySignupOtp);

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), AuthControllers.googleCallbackController)

export const AuthRoutes = router;