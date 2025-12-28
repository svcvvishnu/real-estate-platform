import { prisma } from "@/lib/prisma";
import SearchFilters from "@/components/property/search-filters";
import PropertyCard from "@/components/property/property-card";
import { PropertyType } from "@prisma/client";
import NavControls from "@/components/layout/nav-controls";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;

    const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined;
    const type = typeof resolvedSearchParams.type === "string" && Object.values(PropertyType).includes(resolvedSearchParams.type as PropertyType)
        ? (resolvedSearchParams.type as PropertyType)
        : undefined;

    const minPrice = typeof resolvedSearchParams.minPrice === "string" ? parseFloat(resolvedSearchParams.minPrice) : undefined;
    const maxPrice = typeof resolvedSearchParams.maxPrice === "string" ? parseFloat(resolvedSearchParams.maxPrice) : undefined;

    const where: any = {
        status: "APPROVED",
    };

    if (q) {
        where.OR = [
            { title: { contains: q } },
            { description: { contains: q } },
            { address: { contains: q } }
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
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <NavControls />
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Verified Properties</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="lg:sticky lg:top-8">
                            <SearchFilters />
                        </div>
                    </aside>

                    <main className="flex-1">
                        {properties.length === 0 ? (
                            <div className="bg-white p-12 rounded-lg shadow text-center">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
                                <p className="text-gray-500">Try adjusting your search filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {properties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
