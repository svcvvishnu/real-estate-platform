import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KYCForm from "@/components/kyc/kyc-form";
import NavControls from "@/components/layout/nav-controls";

export default async function KYCPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <NavControls />
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h1 className="text-xl font-semibold text-gray-900 mb-6">Complete Usage Verification</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            To ensure trust, we require all users to verify their identity before buying or selling.
                        </p>
                        <KYCForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
