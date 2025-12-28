import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnKYC = nextUrl.pathname.startsWith("/kyc");

            const isProtectedRoute = isOnDashboard || isOnAdmin || isOnKYC;

            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
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
