import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config"

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
    ...authConfig,
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

                    if (user.password) {
                        const passwordsMatch = await bcrypt.compare(password, user.password)
                        if (passwordsMatch) return user
                    }
                }
                return null
            },
        }),
    ],
})
