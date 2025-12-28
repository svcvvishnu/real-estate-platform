import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LogOut, Home, Search, Heart } from "lucide-react";
import { Suspense } from "react";
import UserProperties, { UserPropertiesSkeleton } from "@/components/property/user-properties";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    // Fetch minimal user data for the layout
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            mobile: true,
            role: true,
            kycStatus: true,
        }
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Session Error</h2>
                    <p className="text-gray-600 mb-4">We couldn't load your profile. Please sign in again.</p>
                    <form action={async () => {
                        "use server";
                        await signOut();
                    }}>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Redirect Admins to Verification Portal
    if (user.role === "ADMIN" || user.role === "VERIFICATION_TEAM") {
        redirect("/admin/verification");
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <Link href="/dashboard" className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Real Estate Trust</h1>
                        </Link>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600">
                                {user.mobile} ({user.role})
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    {/* Navigation Tiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Link
                            href="/search"
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow group border border-transparent hover:border-blue-500"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Browse Properties</h3>
                                    <p className="text-sm text-gray-500">Find your dream home</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/sell"
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow group border border-transparent hover:border-green-500"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">List Property</h3>
                                    <p className="text-sm text-gray-500">Sell or lease your estate</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/shortlist"
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow group border border-transparent hover:border-pink-500"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-600 group-hover:text-white transition-colors text-pink-600">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Shortlisted</h3>
                                    <p className="text-sm text-gray-500">Your favorite properties</p>
                                </div>
                            </div>
                        </Link>

                        <form action={async () => {
                            "use server";
                            await signOut();
                        }} className="h-full">
                            <button type="submit" className="w-full text-left h-full bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow group border border-transparent hover:border-red-500">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        <LogOut className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Logout</h3>
                                        <p className="text-sm text-gray-500">Sign out of your account</p>
                                    </div>
                                </div>
                            </button>
                        </form>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Verification Status</h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Your current KYC status is:</p>
                            </div>
                            <div className="mt-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                   ${user.kycStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        user.kycStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            user.kycStatus === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                 `}>
                                    {user.kycStatus}
                                </span>
                            </div>
                            {user.kycStatus === 'NOT_SUBMITTED' && (
                                <div className="mt-5">
                                    <Link
                                        href="/kyc"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 sm:text-sm"
                                    >
                                        Complete Verification
                                    </Link>
                                </div>
                            )}
                            {user.kycStatus === 'PENDING' && (
                                <div className="mt-5 text-sm text-gray-500">
                                    Our team is reviewing your details. This usually takes 24-48 hours.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Properties Content */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">My Properties</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <Suspense fallback={<UserPropertiesSkeleton />}>
                                <UserProperties userId={userId} />
                            </Suspense>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
