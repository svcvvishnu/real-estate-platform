"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NavControls() {
    const router = useRouter();

    return (
        <div className="flex items-center space-x-4 mb-6">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
            </button>
            <Link
                href="/dashboard"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
                <Home className="mr-1 h-4 w-4" />
                Dashboard
            </Link>
        </div>
    );
}
