import { auth } from "@/auth";
import VerificationButtons from "@/components/admin/verification-buttons";
import LogoutButton from "@/components/logout-button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Real Estate Trust - Verification Portal</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {user.mobile} ({user.role})
                            </span>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Pending Properties</h2>

                    {pendingProperties.length === 0 ? (
                        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
                            No properties pending verification. Good job!
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {pendingProperties.map((property) => (
                                <div key={property.id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col md:flex-row">
                                    <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                                        {property.images[0] ? (
                                            <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-xl font-bold text-gray-900">{property.title}</h2>
                                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">PENDING</span>
                                            </div>
                                            <p className="text-gray-600 mt-1">{property.type} • ₹{property.price.toLocaleString()}</p>
                                            <p className="text-gray-500 text-sm mt-2">{property.address}</p>
                                            <p className="text-gray-700 mt-4">{property.description}</p>

                                            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                                                <p>Owner: {property.owner.name || "Unknown"} ({property.owner.mobile})</p>
                                                <p>Area: {property.area} sqft</p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <VerificationButtons propertyId={property.id} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
