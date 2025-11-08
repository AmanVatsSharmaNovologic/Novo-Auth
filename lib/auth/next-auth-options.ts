import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { logError, logInfo, logWarn } from "@/lib/logging/console";

type CredentialsShape = {
  email: string;
  password: string;
};

const buildCredentialsProvider = () =>
  Credentials({
    name: "Credentials",
    credentials: {
      email: {
        label: "Email",
        type: "email",
        placeholder: "operator@novologic.co",
      },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      logInfo({
        scope: "auth:credentials",
        event: "authorize:start",
        context: {
          hasCredentials: Boolean(credentials),
        },
      });

      if (!credentials?.email || !credentials.password) {
        logWarn({
          scope: "auth:credentials",
          event: "authorize:missing-fields",
        });
        return null;
      }

      const normalizedCredentials: CredentialsShape = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      };

      logInfo({
        scope: "auth:credentials",
        event: "authorize:todo",
        context: {
          email: normalizedCredentials.email,
        },
      });

      throw new Error(
        "Credential login not implemented yet. Wire GraphQL auth mutations."
      );
    },
  });

const buildGoogleProvider = () =>
  Google({
    clientId: process.env.OAUTH_GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET ?? "",
  });

const buildGitHubProvider = () =>
  GitHub({
    clientId: process.env.OAUTH_GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET ?? "",
  });

export const authOptions: NextAuthOptions = {
  providers: [buildCredentialsProvider(), buildGoogleProvider(), buildGitHubProvider()],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      logInfo({
        scope: "auth:callbacks",
        event: "jwt",
        context: {
          provider: account?.provider ?? "credentials",
          hasUser: Boolean(user),
        },
      });

      return token;
    },
    async session({ session, token }) {
      logInfo({
        scope: "auth:callbacks",
        event: "session",
        context: {
          userEmail: session.user?.email ?? null,
          tokenPresent: Boolean(token),
        },
      });

      return session;
    },
    async signIn({ account }) {
      logInfo({
        scope: "auth:callbacks",
        event: "signIn",
        context: {
          provider: account?.provider,
        },
      });
      return true;
    },
  },
  events: {
    async signIn(message) {
      logInfo({
        scope: "auth:events",
        event: "signIn",
        context: message,
      });
    },
    async signOut(message) {
      logInfo({
        scope: "auth:events",
        event: "signOut",
        context: message,
      });
    },
    async error(error) {
      logError({
        scope: "auth:events",
        event: "error",
        context: { error },
      });
    },
  },
  cookies: {
    sessionToken: {
      name: "__Secure-novo-session",
      domain: process.env.NODE_ENV === "development" ? undefined : ".novologic.co",
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    },
  },
  debug: process.env.NODE_ENV !== "production",
  secret: process.env.NEXTAUTH_SECRET,
};


