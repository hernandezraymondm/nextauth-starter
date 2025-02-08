import NextAuth from "next-auth";
import { db } from "@/lib/db";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { delayWithHash } from "@/lib/utils";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "./data/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * - Defines Custom Pages for sign-in and error handling
   * @property {string} signIn - Custom sign-in page path
   * @property {string} error - Custom error page path
   */
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  /**
   * Event callback triggered when a new account
   * in a given provider is linked to a user.
   * This callback automatically verifies the user's email by
   * setting `emailVerified` to the current date.
   * @param {Object} user - The user object
   */
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider !== "credentials") return true;

        if (!user.id) {
          console.warn("Sign-in attempt with missing user ID");
          await delayWithHash();
          return false;
        }

        if (!user.emailVerified) {
          console.warn(`Sign-in blocked for unverified email: ${user.email}`);
          await delayWithHash();
          return false;
        }

        if (user.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            user.id
          );

          if (!twoFactorConfirmation) return false;

          // Delete two factor confirmation for next signin
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        await delayWithHash();
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        Object.assign(token, {
          role: user.role,
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        });
      }
      if (account) {
        token.provider = account.provider;
      }
      if (trigger === "update" && session) {
        Object.assign(token, {
          ...(session.name && { name: session.name }),
          ...(session.email && { email: session.email }),
          ...(session.role && { role: session.role }),
          ...(session.isTwoFactorEnabled && {
            isTwoFactorEnabled: session.isTwoFactorEnabled,
          }),
        });
      }
      return token;
    },

    async session({ token, session }) {
      if (session.user) {
        Object.assign(session.user, {
          id: token.sub,
          role: token.role,
          isTwoFactorEnabled: token.isTwoFactorEnabled,
          provider: token.provider,
        });
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          // if user registered with social
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
});
