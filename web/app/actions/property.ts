"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public/uploads/properties");

const PropertySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 chars"),
    description: z.string().min(10, "Description must be at least 10 chars"),
    price: z.coerce.number().min(1, "Price must be positive"),
    area: z.coerce.number().min(1, "Area must be positive"),
    type: z.enum(["HOUSE", "APARTMENT", "LAND", "COMMERCIAL"]),
    address: z.string().min(5, "Address is required"),
});

export async function createProperty(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validatedFields = PropertySchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        area: formData.get("area"),
        type: formData.get("type"),
        address: formData.get("address"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    // Handle Image Uploads
    if (files.length > 0) {
        try {
            await mkdir(UPLOAD_DIR, { recursive: true });

            for (const file of files) {
                if (file.size > 0 && file.name !== "undefined") {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const filename = `${session.user.id}-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
                    const filepath = join(UPLOAD_DIR, filename);

                    await writeFile(filepath, buffer);
                    imageUrls.push(`/uploads/properties/${filename}`);
                }
            }
        } catch (err) {
            console.error("Image upload failed", err);
            return { error: "Image upload failed" };
        }
    }

    try {
        await prisma.property.create({
            data: {
                ...validatedFields.data,
                status: "PENDING",
                ownerId: session.user.id,
                images: {
                    create: imageUrls.map(url => ({ url }))
                }
            }
        });
    } catch (err) {
        console.error("DB Error", err);
        return { error: "Failed to save property" };
    }

    redirect("/dashboard?property=created");
}
