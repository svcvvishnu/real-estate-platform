"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const RegisterSchema = z.object({
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["BUYER", "SELLER", "ADMIN", "VERIFICATION_TEAM"]),
});

export async function registerUser(formData: FormData) {
    const mobile = formData.get("mobile") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as any;

    const validatedFields = RegisterSchema.safeParse({ mobile, email, password, role });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues[0].message || "Invalid fields",
        };
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { mobile },
                ...(email ? [{ email }] : []),
            ],
        },
    });

    if (existingUser) {
        if (existingUser.mobile === mobile) {
            return { error: "User already exists with this mobile number." };
        }
        return { error: "User already exists with this email." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
        data: {
            mobile,
            email: email || null,
            password: hashedPassword,
            role: role,
        },
    });

    // Redirect to login (or auto-login later)
    redirect("/login?registered=true");
}
