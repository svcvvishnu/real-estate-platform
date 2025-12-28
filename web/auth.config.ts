import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
            }
            return session
        }
    },
    providers: [], // Empty array here, added in auth.ts
    session: {
        strategy: "jwt"
    }
} satisfies NextAuthConfig;
