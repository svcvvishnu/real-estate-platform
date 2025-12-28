import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditPropertyForm from "@/components/property/edit-property-form";
import NavControls from "@/components/layout/nav-controls";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) redirect("/login");

    const property = await prisma.property.findUnique({
        where: { id: id }
    });

    if (!property) notFound();

    // Verify ownership
    if (property.ownerId !== session.user.id) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <NavControls />
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Property Details</h1>
                <EditPropertyForm property={property} />
            </div>
        </div>
    );
}
