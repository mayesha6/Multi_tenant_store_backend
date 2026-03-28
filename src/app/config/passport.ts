/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy, type Profile, type VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import prisma from "../lib/prisma";
import { IsActive, UserRole, AuthProvider } from "@prisma/client";

// ----------------- LOCAL STRATEGY -----------------
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        // Include auths relation to check Google credentials
        const user = await prisma.user.findUnique({
          where: { email },
          include: { auths: true },
        });

        if (!user) return done("User does not exist");
        if (!user.isVerified) return done("User is not verified");
        if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
          return done(`User is ${user.isActive}`);
        }
        if (user.isDeleted) return done("User is deleted");

        const isGoogleAuthenticated = user.auths?.some(a => a.provider === AuthProvider.google);

        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message:
              "You authenticated with Google. Set a password first to login with email/password.",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(password as string, user.password as string);

        if (!isPasswordMatched) return done(null, false, { message: "Password does not match" });

        return done(null, user);
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

// ----------------- GOOGLE STRATEGY -----------------
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: "No email found" });

        // Include auths relation
        let user = await prisma.user.findUnique({
          where: { email },
          include: { auths: true },
        });

        if (user && !user.isVerified) return done(null, false, { message: "User is not verified" });
        if (user && (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE)) {
          return done(`User is ${user.isActive}`);
        }
        if (user && user.isDeleted) return done(null, false, { message: "User is deleted" });

        // If user doesn't exist, create a new one
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName ?? "No Name",
              picture: profile.photos?.[0]?.value ?? null,
              role: UserRole.USER,
              isVerified: true,
              auths: {
                create: [
                  {
                    provider: AuthProvider.google,
                    providerId: profile.id,
                  },
                ],
              },
            },
            include: { auths: true }, // Include auths for consistency
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

// ----------------- SERIALIZE & DESERIALIZE -----------------
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { auths: true },
    });
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

export default passport;