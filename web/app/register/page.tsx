"use client";

import { registerUser } from "@/app/actions/register";
import Link from "next/link";
import { useActionState } from "react";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
        return await registerUser(formData);
    }, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form action={formAction} className="mt-8 space-y-6">
                    {state?.error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                            {state.error}
                        </div>
                    )}
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="mobile" className="sr-only">
                                Mobile Number
                            </label>
                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                required
                                className="relative block w-full rounded-t-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Mobile Number"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email Address (Optional)
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="relative block w-full border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email Address (Optional)"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="sr-only">
                                Account Type
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="relative block w-full border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 appearance-none bg-white"
                            >
                                <option value="" disabled selected>Select Account Type</option>
                                <option value="BUYER">Buyer</option>
                                <option value="SELLER">Seller</option>
                                <option value="ADMIN">Admin</option>
                                <option value="VERIFICATION_TEAM">Verification Team</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="relative block w-full rounded-b-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Set Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            {isPending ? "Creating account..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
