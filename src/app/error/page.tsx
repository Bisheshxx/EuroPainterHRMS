import React from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2 ">Something went wrong</h1>
      <p className="text-gray-600 mb-6 text-center">
        Sorry, an unexpected error has occurred.
        <br />
        Please try again or return to the homepage.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
