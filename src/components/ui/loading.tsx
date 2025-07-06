import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
      <span className="ml-2 text-lg font-semibold text-primary">
        Loading...
      </span>
    </div>
  );
}
