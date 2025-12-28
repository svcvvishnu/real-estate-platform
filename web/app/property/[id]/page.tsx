import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Ruler, Home, Phone, User, Eye } from "lucide-react";
import NavControls from "@/components/layout/nav-controls";
import ShortlistButton from "@/components/property/shortlist-button";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const property = await prisma.property.findUnique({
        where: { id: id },
        include: {
            images: true,
            owner: {
                select: {
                    name: true,
                    mobile: true,
                },
            },
            ...(userId ? { shortlists: { where: { userId } } } : {}),
        },
    });

    if (property && property.status === "APPROVED") {
        // Increment views in background (don't await to avoid slowing down page load)
        prisma.property.update({
            where: { id: id },
            data: { views: { increment: 1 } }
        }).catch(err => console.error("Failed to increment views:", err));
    }

    if (!property) {
        notFound();
    }

    // Only show APPROVED properties to public, unless current user is owner or admin
    const isOwner = session?.user?.id === property.ownerId;
    const isAdmin = await prisma.user.findFirst({
        where: {
            id: session?.user?.id,
            role: { in: ["ADMIN", "VERIFICATION_TEAM"] }
        }
    });

    if (property.status !== "APPROVED" && !isOwner && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <NavControls />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Available</h1>
                    <p className="text-gray-600">This property is currently under review or has been removed.</p>
                </div>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(property.price);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <NavControls />

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Image Gallery (Simplified for MVP - Just showing list of images) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-100">
                        {property.images.length > 0 ? (
                            property.images.map((img, index) => (
                                <div key={img.id} className={`relative aspect-video ${index === 0 && property.images.length > 1 ? "md:col-span-2 md:aspect-[2/1]" : ""}`}>
                                    <img src={img.url} alt={`Property Image ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))
                        ) : (
                            <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-400">No Images Available</div>
                        )}
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {property.address}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {property.views + (property.status === "APPROVED" ? 1 : 0)} views
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-4">
                                <ShortlistButton
                                    propertyId={property.id}
                                    initialIsShortlisted={!!(property as any).shortlists?.length}
                                />
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-900">{formattedPrice}</div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                                        {property.type}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <Ruler className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                                <div className="text-sm text-gray-500">Area</div>
                                <div className="font-semibold">{property.area} sqft</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <Home className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                                <div className="text-sm text-gray-500">Type</div>
                                <div className="font-semibold capitalize">{property.type.toLowerCase()}</div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{property.description}</p>
                        </div>

                        {/* Owner / Contact Section */}
                        <div className="mt-10 bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h2 className="text-lg font-semibold text-blue-900 mb-4">Contact Seller</h2>
                            {session?.user ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mr-4">
                                            {property.owner.name?.charAt(0) || <User />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{property.owner.name || "Verified Seller"}</p>
                                            <p className="text-sm text-blue-700 flex items-center mt-1">
                                                <Phone className="w-3 h-3 mr-1" />
                                                {property.owner.mobile}
                                            </p>
                                        </div>
                                    </div>
                                    <a href={`tel:${property.owner.mobile}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        Call Now
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center py-2">
                                    <p className="text-blue-800 mb-3">Log in to view seller contact details</p>
                                    <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
                                        Log In to View Contact
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
