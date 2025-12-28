import { Suspense } from "react";
import SearchFilters from "@/components/property/search-filters";
import PropertyGrid, { PropertyGridSkeleton } from "@/components/property/property-grid";
import { PropertyType } from "@prisma/client";
import NavControls from "@/components/layout/nav-controls";
import { auth } from "@/auth";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const session = await auth();
    const userId = session?.user?.id;

    const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined;
    const type = typeof resolvedSearchParams.type === "string" && Object.values(PropertyType).includes(resolvedSearchParams.type as PropertyType)
        ? (resolvedSearchParams.type as PropertyType)
        : undefined;

    const minPrice = typeof resolvedSearchParams.minPrice === "string" ? parseFloat(resolvedSearchParams.minPrice) : undefined;
    const maxPrice = typeof resolvedSearchParams.maxPrice === "string" ? parseFloat(resolvedSearchParams.maxPrice) : undefined;

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
                        <Suspense key={`${q}-${type}-${minPrice}-${maxPrice}`} fallback={<PropertyGridSkeleton />}>
                            <PropertyGrid
                                q={q}
                                type={type}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                userId={userId}
                            />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}
