"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { PropertyType } from "@prisma/client";

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState({
        q: searchParams.get("q") || "",
        type: searchParams.get("type") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.q) params.set("q", filters.q);
        if (filters.type) params.set("type", filters.type);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

        startTransition(() => {
            router.push(`/search?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        setFilters({ q: "", type: "", minPrice: "", maxPrice: "" });
        startTransition(() => {
            router.push("/search");
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => handleFilterChange("q", e.target.value)}
                    placeholder="Locations, titles..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All Types</option>
                    {Object.values(PropertyType).map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        placeholder="₹ Min"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                    <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        placeholder="₹ Max"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
                <button
                    onClick={applyFilters}
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
                >
                    {isPending ? "Updating..." : "Search"}
                </button>
                <button
                    onClick={clearFilters}
                    disabled={isPending}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-md transition-colors disabled:opacity-50"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
