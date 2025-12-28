"use client";

import { submitPropertyUpdate } from "@/app/actions/update-property";
import { Property, PropertyType } from "@prisma/client";
import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";

export default function EditPropertyForm({ property }: { property: Property }) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
        const res = await submitPropertyUpdate(formData);
        if (res.success) {
            router.push("/dashboard");
            router.refresh();
        }
        return res;
    }, null);

    return (
        <form action={formAction} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">
                    {state.error}
                </div>
            )}

            <input type="hidden" name="propertyId" value={property.id} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Property Title</label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={property.title}
                        required
                        minLength={5}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                    />
                    <p className="mt-1 text-xs text-gray-400">Minimum 5 characters required.</p>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={property.description}
                        required
                        minLength={10}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-400">Minimum 10 characters required.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        defaultValue={property.price}
                        required
                        min={1}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                    />
                    <p className="mt-1 text-xs text-gray-400">Must be a positive value.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Area (sqft/acres)</label>
                    <input
                        type="number"
                        name="area"
                        defaultValue={property.area}
                        required
                        min={0.01}
                        step="0.01"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                    />
                    <p className="mt-1 text-xs text-gray-400">Must be a positive value.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Property Type</label>
                    <select
                        name="type"
                        defaultValue={property.type}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                    >
                        {Object.values(PropertyType).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        defaultValue={property.address}
                        required
                        minLength={5}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                    />
                    <p className="mt-1 text-xs text-gray-400">Minimum 5 characters required.</p>
                </div>
            </div>

            <div className="pt-5 border-t border-gray-100 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isPending ? "Submitting Request..." : "Submit Updates for Review"}
                </button>
            </div>

            <p className="bg-blue-50 text-blue-800 p-4 rounded-lg text-xs italic">
                Note: Your changes will NOT be visible to other users until they are reviewed and approved by our team.
                The current listing will remain live with its current details until approval.
            </p>
        </form>
    );
}
