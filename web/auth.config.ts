import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/admin") ||
                nextUrl.pathname.startsWith("/kyc");

            const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
                nextUrl.pathname.startsWith("/register");

            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
                return true;
            }

            return true; // Allow public routes
        },
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
    providers: [],
    session: {
        strategy: "jwt"
    }
} satisfies NextAuthConfig;
