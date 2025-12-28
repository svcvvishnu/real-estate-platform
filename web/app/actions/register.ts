"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const RegisterSchema = z.object({
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData) {
    const mobile = formData.get("mobile") as string;
    const password = formData.get("password") as string;

    const validatedFields = RegisterSchema.safeParse({ mobile, password });

    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
        };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { mobile },
    });

    if (existingUser) {
        return {
            error: "User already exists with this mobile number.",
        };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
        data: {
            mobile,
            password: hashedPassword,
        },
    });

    // Redirect to login (or auto-login later)
    redirect("/login?registered=true");
}
