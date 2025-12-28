import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/property/property-form";

export default async function SellPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    // Strict check: Only Verified Users can sell
    if (user?.kycStatus !== "APPROVED") {
        // Allow PENDING for demo purposes? Or strict? 
        // Requirement says: "Only verified users can... List properties"
        // For MVP testing flow (since I can't easily self-approve without admin dashboard), 
        // I might blocking logic here.

        // BLOCKING LOGIC:
        if (user?.kycStatus !== "APPROVED") {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Required</h1>
                    <p className="text-gray-700 text-center max-w-md">
                        You must have an <strong>APPROVED</strong> KYC status to list properties.
                        Your current status is: <span className="font-bold">{user?.kycStatus}</span>.
                    </p>
                    <a href="/dashboard" className="mt-6 text-blue-600 hover:underline">Go back to Dashboard</a>
                </div>
            );
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">List Your Property</h1>
                <PropertyForm />
            </div>
        </div>
    );
}
