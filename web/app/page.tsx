import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
      <main className="flex flex-col items-center text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-blue-900 mb-6">
          Real Estate Trust Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-prose">
          A secure, verified, and broker-less platform for buying, selling, and leasing properties.
        </p>
        <div className="flex gap-4">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Properties <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/sell"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            List Your Property
          </Link>
        </div>
      </main>
    </div>
  );
}
