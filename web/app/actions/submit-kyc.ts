"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

// Ensure upload directory exists
const UPLOAD_DIR = join(process.cwd(), "public/uploads/kyc");

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

    // Handle File Upload (Local Storage for MVP)
    // In production, upload to S3/Blob and get URL
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${session.user.id}-${Date.now()}-${file.name}`;
        const filepath = join(UPLOAD_DIR, filename);
        const publicUrl = `/uploads/kyc/${filename}`;

        // Ensure dir exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        // Write file
        await writeFile(filepath, buffer);

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
