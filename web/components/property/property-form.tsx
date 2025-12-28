"use client";

import { createProperty } from "@/app/actions/property";
import { useActionState, useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";

export default function PropertyForm() {
    const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
        return await createProperty(formData);
    }, null);

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        // Create object URLs for previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // Cleanup
        return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // We need to append files manually to formData because standard form submission 
    // might not handle our state-managed file list if we just rely on the input (which we might clear)
    // However, for simplicity in this server action pattern, we will let the input handle it 
    // OR we can intercept the action.
    // 
    // Challenge: If user removes a file from preview, the original input still has it? 
    // Actually, file inputs are read-only. 
    // SOLUTION: We will clear the input value after selection so user can add more.
    // AND we will manually inject the files into the FormData before calling the server action.
    // BUT useActionState wraps the action. 
    //
    // ALTERNATIVE: Use a hidden input approach or manual fetch. 
    // With `useActionState`, we can't easily modify formData on the fly before it hits the action wrapper?
    // Actually we can wrap the dispatch. 

    const handleSubmit = (payload: FormData) => {
        // Append our state files to the payload
        // First delete any 'images' from the input to avoid duplicates or stale data
        payload.delete("images");

        files.forEach(file => {
            payload.append("images", file);
        });

        formAction(payload);
    };

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Property Title</label>
                    <input type="text" name="title" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="e.g. 3BHK Apartment in City Center" />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" rows={3} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Describe the property..."></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input type="number" name="price" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Area (sqft/acres)</label>
                    <input type="number" name="area" required step="0.01" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        <option value="HOUSE">House</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="LAND">Land</option>
                        <option value="COMMERCIAL">Commercial</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" name="address" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Full address" />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Property Images</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label htmlFor="images-input" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                                    <span>Upload files</span>
                                    <input
                                        id="images-input"
                                        type="file"
                                        multiple
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        // Reset value to allow selecting same file again if needed
                                        onClick={(e) => (e.target as HTMLInputElement).value = ''}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>

                    {/* Image Previews */}
                    {files.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previews.map((url, index) => (
                                <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={isPending || files.length === 0} className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50">
                    {isPending ? "Uploading..." : "List Property"}
                </button>
            </div>
        </form>
    );
}
