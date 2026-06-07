import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions, getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { ApiError } from "@/lib/errors";
import { getPrisma } from "@/lib/db";
import { getOptionalEnv } from "@/lib/env";

const optionalEnv = getOptionalEnv();

const providers: NextAuthOptions["providers"] = [];

if (optionalEnv.GITHUB_CLIENT_ID && optionalEnv.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: optionalEnv.GITHUB_CLIENT_ID,
      clientSecret: optionalEnv.GITHUB_CLIENT_SECRET,
    }),
  );
}

if (optionalEnv.EMAIL_SERVER && optionalEnv.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: optionalEnv.EMAIL_SERVER,
      from: optionalEnv.EMAIL_FROM,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(getPrisma()),
  providers,
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user?.id) {
    throw new ApiError("UNAUTHORIZED", "请先登录", 401);
  }

  return user;
}
