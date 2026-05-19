import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Role = "LEARNER" | "ADMIN" | "INSTRUCTOR" | "SUPER_ADMIN";

/**
 * NextAuth configuration for Trilingua AI.
 * Demo mode: uses in-memory test accounts (no database required).
 * When DATABASE_URL is connected, it will use Prisma adapter.
 */

// Demo test accounts — no DB required
const testAccounts: Record<
  string,
  { password: string; name: string; role: Role; image: string; id: string }
> = {
  "student@test.com": {
    id: "demo-student-001",
    password: "password123",
    name: "Alex Student",
    role: "LEARNER",
    image: "https://ui-avatars.com/api/?name=Alex+Student&background=6D28D9&color=fff&bold=true",
  },
  "admin@test.com": {
    id: "demo-admin-001",
    password: "password123",
    name: "Admin User",
    role: "ADMIN",
    image: "https://ui-avatars.com/api/?name=Admin+User&background=14B8A6&color=fff&bold=true",
  },
  "instructor@test.com": {
    id: "demo-instructor-001",
    password: "password123",
    name: "Prof. Instructor",
    role: "INSTRUCTOR",
    image: "https://ui-avatars.com/api/?name=Prof+Instructor&background=F59E0B&color=fff&bold=true",
  },
};

export const authOptions: NextAuthOptions = {
  // No adapter — pure JWT mode for demo (no DB dependency)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Check test accounts (no database needed)
        const testUser = testAccounts[email];
        if (testUser) {
          return {
            id: testUser.id,
            email,
            name: testUser.name,
            image: testUser.image,
            role: testUser.role,
          };
        }

        // Demo mode fallback: any email works as LEARNER
        return {
          id: `demo-${Date.now()}`,
          email,
          name: email.split("@")[0],
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split("@")[0])}&background=6D28D9&color=fff&bold=true`,
          role: "LEARNER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as Role;
      }
      return session;
    },
  },
};

// Type augmentation for session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
