"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PropertyUpdateSchema = z.object({
    propertyId: z.string(),
    title: z.string().min(5, "Title must be at least 5 chars"),
    description: z.string().min(10, "Description must be at least 10 chars"),
    price: z.coerce.number().min(1, "Price must be positive"),
    area: z.coerce.number().min(1, "Area must be positive"),
    type: z.enum(["HOUSE", "APARTMENT", "LAND", "COMMERCIAL"]),
    address: z.string().min(5, "Address is required"),
});

export async function submitPropertyUpdate(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const rawData = {
        propertyId: formData.get("propertyId"),
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        area: formData.get("area"),
        type: formData.get("type"),
        address: formData.get("address"),
    };

    const validated = PropertyUpdateSchema.safeParse(rawData);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    const { propertyId, ...updateData } = validated.data;

    // Verify ownership
    const property = await prisma.property.findUnique({
        where: { id: propertyId }
    });

    if (!property || property.ownerId !== session.user.id) {
        return { error: "Permission Denied" };
    }

    try {
        await prisma.propertyUpdate.upsert({
            where: { propertyId: propertyId },
            update: {
                ...updateData,
                status: "PENDING",
                rejectionReason: null,
            },
            create: {
                propertyId: propertyId,
                ...updateData,
                status: "PENDING",
            },
        });
    } catch (error) {
        console.error("Failed to submit update:", error);
        return { error: "Database error" };
    }

    revalidatePath(`/dashboard`);
    revalidatePath(`/property/${propertyId}`);
    return { success: true };
}
