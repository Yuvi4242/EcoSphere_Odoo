import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/_lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Determine selected role, falling back to email check
        const selectedRole = credentials?.role?.toUpperCase() === 'ADMIN' 
          ? 'ADMIN' 
          : credentials?.role?.toUpperCase() === 'EMPLOYEE'
            ? 'EMPLOYEE'
            : credentials.email.toLowerCase().includes('admin') ? "ADMIN" : "EMPLOYEE";

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          // Create new user with selected role
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              password: credentials.password,
              role: selectedRole
            }
          });
          return { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
        }

        // Check password and sync role to selected role for development convenience
        if (user.password === credentials.password) {
          if (user.role !== selectedRole && credentials.role) {
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { role: selectedRole }
            });
            return { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role };
          }
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
