import Link from "next/link";
import { Property, PropertyImage } from "@prisma/client";

interface PropertyCardProps {
    property: Property & { images: PropertyImage[] };
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const mainImage = property.images[0]?.url || "/placeholder-property.jpg"; // You might want a better placeholder
    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(property.price);

    return (
        <Link href={`/property/${property.id}`} className="group relative block overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">

            {/* Image Aspect Ratio Container */}
            <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                {property.images[0] ? (
                    <img
                        src={mainImage}
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}

                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 uppercase">
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
    );
}
