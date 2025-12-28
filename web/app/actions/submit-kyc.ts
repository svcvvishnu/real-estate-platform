"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { put } from "@vercel/blob";

// Vercel Blob doesn't need local UPLOAD_DIR
const KYCSchema = z.object({
    fullName: z.string().min(2, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    governmentIdType: z.string().min(1, "ID Type is required"),
});

export async function submitKYC(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const governmentIdType = formData.get("governmentIdType") as string;
    const file = formData.get("document") as File;

    const validatedFields = KYCSchema.safeParse({ fullName, email, governmentIdType });

    if (!validatedFields.success) {
        return { error: "Invalid form data" };
    }

    if (!file || file.size === 0) {
        return { error: "Document upload is required" };
    }

    try {
        // Upload to Vercel Blob
        const blob = await put(`kyc/${session.user.id}-${Date.now()}-${file.name}`, file, {
            access: 'public',
        });

        const publicUrl = blob.url;

        // Create KYC Profile & Update User Status
        await prisma.$transaction([
            prisma.kYCProfile.create({
                data: {
                    userId: session.user.id,
                    fullName,
                    email,
                    governmentIdType,
                    documentUrl: publicUrl,
                    status: "PENDING",
                },
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: { kycStatus: "PENDING" },
            }),
        ]);

    } catch (error) {
        console.error("KYC Upload Error:", error);
        return { error: "Failed to upload document or save data." };
    }

    redirect("/dashboard?kyc=submitted");
}
