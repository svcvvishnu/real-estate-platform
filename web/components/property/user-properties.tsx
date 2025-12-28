import { prisma } from "@/lib/prisma";
import { PropertyStatus } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

interface UserPropertiesProps {
    userId: string;
}

export default async function UserProperties({ userId }: UserPropertiesProps) {
    const properties = await prisma.property.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
            images: true,
            updates: true
        }
    });

    if (properties.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500">You haven&apos;t listed any properties yet.</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-200">
            {properties.map((property: any) => (
                <li key={property.id} className="py-4 flex justify-between">
                    <div className="flex">
                        <div className="relative h-16 w-16 mr-4 flex-shrink-0">
                            {property.images[0] ? (
                                <Image
                                    src={property.images[0].url}
                                    alt={property.title}
                                    fill
                                    className="rounded object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">{property.title}</h4>
                            <p className="text-sm text-gray-500">{property.type} • ₹{property.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{property.address}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-center space-y-2">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full 
                    ${property.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    property.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {property.status}
                        </span>
                        {property.updates?.status === 'PENDING' && (
                            <span className="inline-flex px-2 text-[10px] font-semibold leading-5 rounded-full bg-blue-100 text-blue-800">
                                PENDING UPDATE
                            </span>
                        )}
                        <Link
                            href={`/dashboard/edit/${property.id}`}
                            className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                        >
                            Edit Details
                        </Link>
                        {property.status === 'REJECTED' && (
                            <p className="text-xs text-red-500">{property.rejectionReason}</p>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function UserPropertiesSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between py-4 animate-pulse">
                    <div className="flex">
                        <div className="h-16 w-16 bg-gray-200 rounded mr-4" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-3 bg-gray-200 rounded w-24" />
                            <div className="h-2 bg-gray-200 rounded w-40" />
                        </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full" />
                </div>
            ))}
        </div>
    );
}
