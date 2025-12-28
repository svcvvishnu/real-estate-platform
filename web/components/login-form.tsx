"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const mobile = formData.get("mobile") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                mobile,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials");
                setLoading(false);
            } else {
                // Successful login - redirect to dashboard
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An error occurred during login");
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <label htmlFor="mobile" className="sr-only">
                        Mobile or Email
                    </label>
                    <input
                        id="mobile"
                        name="mobile"
                        type="text"
                        required
                        disabled={loading}
                        className="relative block w-full rounded-t-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 disabled:opacity-50"
                        placeholder="Mobile or Email"
                    />
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
                        disabled={loading}
                        className="relative block w-full rounded-b-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 disabled:opacity-50"
                        placeholder="Password"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </div>
        </form>
    );
}
