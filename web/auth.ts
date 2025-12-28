import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

async function getUser(mobile: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { mobile },
        })
        return user
    } catch (error) {
        console.error("Failed to fetch user:", error)
        throw new Error("Failed to fetch user.")
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ mobile: z.string().min(10), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { mobile, password } = parsedCredentials.data
                    const user = await getUser(mobile)
                    if (!user) return null

                    // For MVP demo where users are created via our form with 'password'
                    // We will mock OTP by using a simple password match for now.
                    if (user.password) {
                        const passwordsMatch = await bcrypt.compare(password, user.password)
                        if (passwordsMatch) return user
                    }
                }

                console.log("Invalid credentials")
                return null
            },
        }),
    ],
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
            // Add user ID and role to session
            if (token.sub && session.user) {
                // We'll need to extend the type definition later, casting for now
                (session.user as any).id = token.sub
                    ; (session.user as any).role = token.role
            }
            return session
        }
    },
    session: {
        strategy: "jwt"
    }
})
