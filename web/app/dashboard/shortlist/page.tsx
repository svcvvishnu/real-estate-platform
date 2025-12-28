import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PropertyCard from "@/components/property/property-card";
import NavControls from "@/components/layout/nav-controls";

export default async function ShortlistPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    // Fetch shortlisted properties
    const shortlists = await prisma.shortlist.findMany({
        where: { userId },
        include: {
            property: {
                include: {
                    images: true,
                    shortlists: { where: { userId } }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const properties = shortlists.map(s => s.property);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <NavControls />
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Shortlisted Properties</h1>

                {properties.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm text-center">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No shortlists yet</h3>
                        <p className="text-gray-500 mb-6">Explore properties and click the heart icon to save them here.</p>
                        <a href="/search" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                            Browse properties
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property: any) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
