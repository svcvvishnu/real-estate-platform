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
                console.log("Authorize called with:", credentials)
                const parsedCredentials = z
                    .object({ mobile: z.string().min(10), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { mobile, password } = parsedCredentials.data
                    console.log("Searching for user with mobile:", mobile)
                    const user = await getUser(mobile)
                    if (!user) {
                        console.log("User not found for mobile:", mobile)
                        return null
                    }
                    console.log("User found:", user.mobile, "Role:", user.role)

                    if (user.password) {
                        const passwordsMatch = await bcrypt.compare(password, user.password)
                        console.log("Password match result:", passwordsMatch)
                        if (passwordsMatch) return user
                    } else {
                        console.log("User has no password set")
                    }
                } else {
                    console.log("Credential validation failed:", parsedCredentials.error.format())
                }

                console.log("Invalid credentials - returning null")
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
