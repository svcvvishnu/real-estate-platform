import Image from "next/image";
import Link from "next/link";
import { Property, PropertyImage, Shortlist } from "@prisma/client";
import ShortlistButton from "./shortlist-button";

interface PropertyCardProps {
    property: Property & {
        images: PropertyImage[];
        shortlists?: Shortlist[];
    };
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const mainImage = property.images[0]?.url;
    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(property.price);

    const isShortlisted = property.shortlists && property.shortlists.length > 0;

    return (
        <div className="group relative block overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <Link href={`/property/${property.id}`} className="block">
                {/* Image Aspect Ratio Container */}
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                    {mainImage ? (
                        <Image
                            src={mainImage}
                            alt={property.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            priority={false}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No Image
                        </div>
                    )}

                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 uppercase">
                        {property.type}
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{property.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">{property.address}</p>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-xl font-bold text-blue-900">{formattedPrice}</p>
                        <p className="text-sm text-gray-600">{property.area} sqft</p>
                    </div>
                </div>
            </Link>

            <div className="absolute top-2 right-2 z-10">
                <ShortlistButton
                    propertyId={property.id}
                    initialIsShortlisted={!!isShortlisted}
                />
            </div>
        </div>
    );
}
