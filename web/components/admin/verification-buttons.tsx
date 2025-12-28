"use client";

import { verifyProperty } from "@/app/actions/admin";
import { useState } from "react";

export default function VerificationButtons({ propertyId }: { propertyId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState("");

    const handleApprove = async () => {
        console.log("Client: Approve Clicked");
        setIsLoading(true);
        try {
            await verifyProperty(propertyId, "APPROVE");
            console.log("Client: Approve Sent");
        } catch (error) {
            console.error("Client: Approve Failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Client: Reject Clicked");
        setIsLoading(true);
        try {
            await verifyProperty(propertyId, "REJECT", reason);
            console.log("Client: Reject Sent");
        } catch (error) {
            console.error("Client: Reject Failed", error);
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
                {isLoading ? "Processing..." : "Approve"}
            </button>

            <form onSubmit={handleReject} className="flex-1 flex space-x-2">
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Rejection reason..."
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
