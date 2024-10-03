import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  // Override the default NextAuth pages with your own custom pages
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // If user is created using social login, we want to set the emailVerified field
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      // 2FA check
      if (existingUser?.isTwoFactorEnabled) {
        // Verify if we have the two factor confirmation
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        // Id we don't have the confirmation, we return false
        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor confirmation for next sign in
        // We want to make sure that the user has to confirm the 2FA code every time they sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      // When we update user information, we need to update the token and consequently the session
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      // If I don't have token.sub, it means that the user is not logged in
      if (!token.sub) return token;
      // We use getUserById because it is a much less expensive query than using getUserByEmail (because it is a primary key)
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      // We add the role to the token
      token.role = existingUser.role;
      // Add isTwoFactorEnabled
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      // Related with update user information.
      // We need to know if the user was registered with OAuth, because it will have different fields to modify
      const existingAccount = await getAccountByUserId(existingUser.id);

      // When we update user information, we need to update the token
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isOAuth = !!existingAccount;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
