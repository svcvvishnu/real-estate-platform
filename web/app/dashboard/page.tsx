import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch latest user data
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            kycProfile: true,
            properties: {
                orderBy: { createdAt: 'desc' },
                include: { images: true }
            }
        }
    });

    if (!user) return <div>User not found</div>;

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                    {/* Properties or Other Content */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">My Properties</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            {user.properties.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-md">
                                    <p className="text-gray-500">You haven&apos;t listed any properties yet.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {user.properties.map((property) => (
                                        <li key={property.id} className="py-4 flex justify-between">
                                            <div className="flex">
                                                {property.images[0] ? (
                                                    <img src={property.images[0].url} alt={property.title} className="h-16 w-16 rounded object-cover mr-4" />
                                                ) : (
                                                    <div className="h-16 w-16 bg-gray-200 rounded mr-4 flex items-center justify-center text-xs text-gray-500">No Img</div>
                                                )}
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">{property.title}</h4>
                                                    <p className="text-sm text-gray-500">{property.type} • ₹{property.price.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-400">{property.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end justify-center">
                                                <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full 
                                            ${property.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            property.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {property.status}
                                                </span>
                                                {property.status === 'REJECTED' && (
                                                    <p className="text-xs text-red-500 mt-1">{property.rejectionReason}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
