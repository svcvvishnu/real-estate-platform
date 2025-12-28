import { prisma } from "@/lib/prisma";
import PropertyCard from "./property-card";
import { PropertyType } from "@prisma/client";

interface PropertyGridProps {
    q?: string;
    type?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    userId?: string;
}

export default async function PropertyGrid({ q, type, minPrice, maxPrice, userId }: PropertyGridProps) {
    const where: any = {
        status: "APPROVED",
    };

    if (q) {
        where.OR = [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } }
        ];
    }

    if (type) {
        where.type = type;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const properties = await prisma.property.findMany({
        where,
        include: {
            images: true,
            ...(userId ? { shortlists: { where: { userId } } } : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (properties.length === 0) {
        return (
            <div className="bg-white p-12 rounded-lg shadow text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your search filters.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
    );
}

export function PropertyGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden h-[380px] animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="flex justify-between pt-4">
                            <div className="h-6 bg-gray-200 rounded w-1/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
