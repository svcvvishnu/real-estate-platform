"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleShortlist } from "@/app/actions/shortlist";
import { useRouter } from "next/navigation";

interface ShortlistButtonProps {
    propertyId: string;
    initialIsShortlisted: boolean;
}

export default function ShortlistButton({ propertyId, initialIsShortlisted }: ShortlistButtonProps) {
    const [isShortlisted, setIsShortlisted] = useState(initialIsShortlisted);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        const res = await toggleShortlist(propertyId);

        if (res.error === "Unauthorized") {
            router.push("/login");
            return;
        }

        if (res.success) {
            setIsShortlisted(res.action === "added");
        }
        setIsLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${isShortlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/70 text-gray-600 hover:bg-white hover:text-red-500"
                }`}
            title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
            <Heart className={`w-5 h-5 ${isShortlisted ? "fill-current" : ""}`} />
        </button>
    );
}
