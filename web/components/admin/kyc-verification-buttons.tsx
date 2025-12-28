"use client";

import { verifyKYC } from "@/app/actions/admin";
import { useState } from "react";

export default function KYCVerificationButtons({ profileId }: { profileId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState("");

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            await verifyKYC(profileId, "APPROVE");
        } catch (error) {
            console.error("KYC Approve Failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await verifyKYC(profileId, "REJECT", reason);
        } catch (error) {
            console.error("KYC Reject Failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex space-x-4">
            <button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors disabled:opacity-50"
            >
                {isLoading ? "Processing..." : "Approve KYC"}
            </button>

            <form onSubmit={handleReject} className="flex-1 flex space-x-2">
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    required
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm text-black"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Reject
                </button>
            </form>
        </div>
    );
}
