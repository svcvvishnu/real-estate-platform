"use client";

import { submitKYC } from "@/app/actions/submit-kyc";
import { useActionState } from "react";
import { UploadCloud } from "lucide-react";

export default function KYCForm() {
    const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
        return await submitKYC(formData);
    }, null);

    return (
        <form action={formAction} className="space-y-6">
            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {state.error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="As per Government ID"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="For notifications"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">ID Type</label>
                <select
                    name="governmentIdType"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="DL">Driving License</option>
                    <option value="PASSPORT">Passport</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Upload ID Document</label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="document"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                            >
                                <span>Upload a file</span>
                                <input id="document" name="document" type="file" className="sr-only" required />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isPending ? "Submitting..." : "Submit for Verification"}
            </button>
        </form>
    );
}
