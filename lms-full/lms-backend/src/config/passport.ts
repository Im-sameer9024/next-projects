import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./prisma";
import type { User } from "@/generated/prisma/client";
import { Roles } from "@/generated/prisma/enums";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found"), false);
        }

        // FIND USER

        let user: User | null = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        // CREATE USER

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,

              email,

              avatar: profile.photos?.[0]?.value || "",

              googleId: profile.id,

              isVerified: true,

              role: Roles.USER,
            },
          });
        }

        // UPDATE GOOGLE ID IF MISSING

        if (!user?.googleId) {
          user = await prisma.user.update({
            where: {
              id: user.id,
            },

            data: {
              googleId: profile.id,
            },
          });
        }

        return done(null, {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar ?? "",
        });
      } catch (error) {
        return done(error as Error, false);
      }
    },
  ),
);
