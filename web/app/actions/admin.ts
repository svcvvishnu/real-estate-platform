"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Removed { redirect } as it was unused in original
import { z } from "zod";

const VerificationSchema = z.object({
    propertyId: z.string(),
    action: z.enum(["APPROVE", "REJECT"]),
    reason: z.string().optional(),
});

export async function verifyProperty(propertyId: string, action: "APPROVE" | "REJECT", reason?: string) {
    console.log("---- Admin Action Triggered (Direct Call) ----");
    const session = await auth();

    if (!session?.user?.id) {
        console.log("Error: Unauthorized - No session");
        return { error: "Unauthorized" };
    }

    // Check Role
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });
    console.log(`User: ${user?.mobile}, Role: ${user?.role}`);

    if (user?.role !== "ADMIN" && user?.role !== "VERIFICATION_TEAM") {
        console.log("Error: Permission Denied");
        return { error: "Permission Denied" };
    }

    console.log(`Processing: PropertyID=${propertyId}, Action=${action}, Reason=${reason || 'N/A'}`);

    const validated = VerificationSchema.safeParse({ propertyId, action, reason });

    if (!validated.success) {
        console.log("Error: Validation Failed", validated.error);
        return { error: "Invalid Input" };
    }

    try {
        if (action === "APPROVE") {
            const res = await prisma.property.update({
                where: { id: propertyId },
                data: { status: "APPROVED", rejectionReason: null }
            });
            console.log("Success: Property Approved", res.id);
        } else {
            const res = await prisma.property.update({
                where: { id: propertyId },
                data: { status: "REJECTED", rejectionReason: reason || "Does not meet guidelines" }
            });
            console.log("Success: Property Rejected", res.id);
        }
    } catch (error) {
        console.error("Error: Database Update Failed", error);
        return { error: "Database Update Failed" };
    }

    revalidatePath("/admin/verification");
    revalidatePath("/dashboard");
}
