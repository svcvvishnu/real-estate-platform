import { signIn } from "@/auth";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{" "}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            create a new account
                        </Link>
                    </p>
                </div>
                <form
                    action={async (formData) => {
                        "use server";
                        await signIn("credentials", formData, { redirectTo: "/dashboard" });
                    }}
                    className="mt-8 space-y-6"
                >
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
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Mobile Number"
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
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
