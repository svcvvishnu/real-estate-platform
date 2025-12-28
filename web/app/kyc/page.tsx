import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KYCForm from "@/components/kyc/kyc-form";

export default async function KYCPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Check if already pending or approved
    // Ideally fetch latest user status here, using session for now 
    // (Note: session might be stale, but good for MVP redirect)

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h1 className="text-xl font-semibold text-gray-900 mb-6">Complete Usage Verification</h1>
                    <p className="text-sm text-gray-500 mb-6">
                        To ensure trust, we require all users to verify their identity before buying or selling.
                    </p>
                    <KYCForm />
                </div>
            </div>
        </div>
    );
}
