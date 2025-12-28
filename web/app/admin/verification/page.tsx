import { auth } from "@/auth";
import VerificationButtons from "@/components/admin/verification-buttons";
import KYCVerificationButtons from "@/components/admin/kyc-verification-buttons";
import UpdateVerificationButtons from "@/components/admin/update-verification-buttons";
import LogoutButton from "@/components/logout-button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, FileText, Home as HomeIcon } from "lucide-react";

export default async function AdminVerificationPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (user?.role !== "ADMIN" && user?.role !== "VERIFICATION_TEAM") {
        return <div className="p-10 text-red-600">Access Denied. Admins only.</div>;
    }

    // Fetch Pending Properties
    const pendingProperties = await prisma.property.findMany({
        where: { status: "PENDING" },
        include: {
            images: true,
            owner: { select: { name: true, mobile: true } }
        },
        orderBy: { createdAt: "asc" }
    });

    // Fetch Pending KYC Profiles
    const pendingKYC = await prisma.kYCProfile.findMany({
        where: { status: "PENDING" },
        include: { user: { select: { mobile: true } } },
        orderBy: { createdAt: "asc" }
    });

    // Fetch Pending Property Updates
    const pendingUpdates = await prisma.propertyUpdate.findMany({
        where: { status: "PENDING" },
        include: {
            property: {
                include: { owner: true }
            }
        },
        orderBy: { createdAt: "asc" }
    });

    // Fetch Verification History (Last 20)
    const historyKYC = await prisma.kYCProfile.findMany({
        where: { status: { in: ["APPROVED", "REJECTED"] } },
        include: {
            user: { select: { mobile: true } },
            verifiedBy: { select: { mobile: true, name: true } }
        },
        orderBy: { updatedAt: "desc" },
        take: 10
    });

    const historyProperties = await prisma.property.findMany({
        where: { status: { in: ["APPROVED", "REJECTED"] } },
        include: {
            owner: { select: { mobile: true, name: true } },
            verifiedBy: { select: { mobile: true, name: true } }
        },
        orderBy: { updatedAt: "desc" },
        take: 10
    });

    const historyUpdates = await prisma.propertyUpdate.findMany({
        where: { status: { in: ["APPROVED", "REJECTED"] } },
        include: {
            property: { include: { owner: { select: { mobile: true, name: true } } } },
            verifiedBy: { select: { mobile: true, name: true } }
        },
        orderBy: { updatedAt: "desc" },
        take: 10
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                                <HomeIcon className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">Verification Portal</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {user.mobile} ({user.role})
                            </span>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Property Update Requests Section */}
                <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-6">
                        <FileText className="w-6 h-6 text-orange-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Property Update Requests</h2>
                        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {pendingUpdates.length} Pending
                        </span>
                    </div>

                    {pendingUpdates.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                            No property updates pending.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {pendingUpdates.map((update: any) => (
                                <div key={update.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="mb-6 pb-4 border-b border-gray-50 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Update for: {update.property.title}</h3>
                                            <p className="text-xs text-gray-500">Owner: {update.property.owner.name} ({update.property.owner.mobile})</p>
                                        </div>
                                        <Link href={`/property/${update.propertyId}`} target="_blank" className="text-xs text-blue-600 hover:underline">View Live Listing</Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        {/* Current State */}
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Current Details</h4>
                                            <div className="space-y-3 text-sm">
                                                <p><span className="font-semibold">Title:</span> {update.property.title}</p>
                                                <p><span className="font-semibold">Price:</span> ₹{update.property.price.toLocaleString()}</p>
                                                <p><span className="font-semibold">Area:</span> {update.property.area} sqft</p>
                                                <p><span className="font-semibold">Type:</span> {update.property.type}</p>
                                                <p><span className="font-semibold">Address:</span> {update.property.address}</p>
                                                <div className="pt-2 border-t border-gray-200">
                                                    <p className="text-xs italic text-gray-500 line-clamp-3">{update.property.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Proposed Update */}
                                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-4">Proposed Updates</h4>
                                            <div className="space-y-3 text-sm">
                                                <p className={update.title !== update.property.title ? "text-orange-900 font-bold" : ""}>
                                                    <span className="font-semibold">Title:</span> {update.title}
                                                </p>
                                                <p className={update.price !== update.property.price ? "text-orange-900 font-bold" : ""}>
                                                    <span className="font-semibold">Price:</span> ₹{update.price.toLocaleString()}
                                                </p>
                                                <p className={update.area !== update.property.area ? "text-orange-900 font-bold" : ""}>
                                                    <span className="font-semibold">Area:</span> {update.area} sqft
                                                </p>
                                                <p className={update.type !== update.property.type ? "text-orange-900 font-bold" : ""}>
                                                    <span className="font-semibold">Type:</span> {update.type}
                                                </p>
                                                <p className={update.address !== update.property.address ? "text-orange-900 font-bold" : ""}>
                                                    <span className="font-semibold">Address:</span> {update.address}
                                                </p>
                                                <div className="pt-2 border-t border-orange-200">
                                                    <p className={`text-xs italic line-clamp-3 ${update.description !== update.property.description ? "text-orange-900 font-bold" : "text-gray-500"}`}>
                                                        {update.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <UpdateVerificationButtons updateId={update.id} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* KYC Verification Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <User className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">KYC Verification</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {pendingKYC.length} Pending
                            </span>
                        </div>

                        {pendingKYC.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                                No KYC profiles pending.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingKYC.map((profile) => (
                                    <div key={profile.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{profile.fullName}</h3>
                                                <p className="text-sm text-gray-500">{profile.email} • {profile.user.mobile}</p>
                                            </div>
                                            <span className="text-xs font-medium text-gray-400">
                                                ID: {profile.governmentIdType}
                                            </span>
                                        </div>

                                        <div className="mb-6">
                                            <a
                                                href={profile.documentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-blue-600 hover:underline"
                                            >
                                                <FileText className="w-4 h-4 mr-1" />
                                                View Document
                                            </a>
                                        </div>

                                        <KYCVerificationButtons profileId={profile.id} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Property Verification Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <HomeIcon className="w-6 h-6 text-green-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Property Listings</h2>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {pendingProperties.length} Pending
                            </span>
                        </div>

                        {pendingProperties.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                                No properties pending.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingProperties.map((property) => (
                                    <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="sm:w-32 h-32 flex-shrink-0 bg-gray-100">
                                                {property.images[0] ? (
                                                    <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400"><HomeIcon /></div>
                                                )}
                                            </div>
                                            <div className="p-4 flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 leading-tight">{property.title}</h3>
                                                        <p className="text-xs text-gray-500 mt-1">{property.address}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-blue-600">₹{property.price.toLocaleString()}</div>
                                                        <div className="text-[10px] text-gray-400 capitalize">{property.type.toLowerCase()}</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-2 mb-4">{property.description}</p>
                                                <div className="flex justify-between items-center text-[10px] text-gray-500 border-t pt-3">
                                                    <span>Owner: {property.owner.name} ({property.owner.mobile})</span>
                                                </div>
                                                <div className="mt-4">
                                                    <VerificationButtons propertyId={property.id} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Verification History Section */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-8">
                        <FileText className="w-6 h-6 text-gray-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Recently Processed</h2>
                        <span className="text-sm font-normal text-gray-500 ml-2">(Last 10 items)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* KYC History */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">KYC History</h3>
                            {historyKYC.length === 0 ? (
                                <p className="text-xs text-gray-400 px-2 italic">No recently processed KYC.</p>
                            ) : (
                                <div className="space-y-3">
                                    {historyKYC.map((item: any) => (
                                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-xs">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold">{item.fullName}</span>
                                                <span className={`px-1.5 py-0.5 rounded ${item.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 mb-2">{item.user.mobile}</p>
                                            <div className="pt-2 border-t border-gray-50 flex justify-between text-[10px]">
                                                <span className="text-gray-400 italic">By: {item.verifiedBy?.mobile || 'System'}</span>
                                                <span className="text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Property History */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Property History</h3>
                            {historyProperties.length === 0 ? (
                                <p className="text-xs text-gray-400 px-2 italic">No recently processed properties.</p>
                            ) : (
                                <div className="space-y-3">
                                    {historyProperties.map((item: any) => (
                                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-xs">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold line-clamp-1">{item.title}</span>
                                                <span className={`px-1.5 py-0.5 rounded ${item.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 mb-2">Owner: {item.owner.name}</p>
                                            <div className="pt-2 border-t border-gray-50 flex justify-between text-[10px]">
                                                <span className="text-gray-400 italic">By: {item.verifiedBy?.mobile || 'System'}</span>
                                                <span className="text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Update History */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Update History</h3>
                            {historyUpdates.length === 0 ? (
                                <p className="text-xs text-gray-400 px-2 italic">No recently processed updates.</p>
                            ) : (
                                <div className="space-y-3">
                                    {historyUpdates.map((item: any) => (
                                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-xs">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold line-clamp-1">{item.title}</span>
                                                <span className={`px-1.5 py-0.5 rounded ${item.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 mb-2">Ref: {item.property.title}</p>
                                            <div className="pt-2 border-t border-gray-50 flex justify-between text-[10px]">
                                                <span className="text-gray-400 italic">By: {item.verifiedBy?.mobile || 'System'}</span>
                                                <span className="text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
