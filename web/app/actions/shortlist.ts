"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleShortlist(propertyId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    try {
        const existing = await prisma.shortlist.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        if (existing) {
            await prisma.shortlist.delete({
                where: {
                    userId_propertyId: {
                        userId,
                        propertyId
                    }
                }
            });
            revalidatePath("/dashboard/shortlist");
            revalidatePath(`/property/${propertyId}`);
            return { success: true, action: "removed" };
        } else {
            await prisma.shortlist.create({
                data: { userId, propertyId }
            });
            revalidatePath("/dashboard/shortlist");
            revalidatePath(`/property/${propertyId}`);
            return { success: true, action: "added" };
        }
    } catch (error) {
        console.error("Shortlist Toggle Error:", error);
        return { error: "Failed to update shortlist" };
    }
}
