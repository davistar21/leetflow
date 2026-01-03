"use client";

import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusFooterProps {
  status: "idle" | "generating" | "generated" | "posting" | "success" | "error";
  message: string;
  resultUrls: { gist: string; tweet: string };
}

export function StatusFooter({
  status,
  message,
  resultUrls,
}: StatusFooterProps) {
  if (status === "idle") return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-900 border shadow-lg rounded-xl p-4 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10 fade-in">
      <div className="flex items-center gap-2">
        {status === "error" && <AlertCircle className="text-red-500 w-5 h-5" />}
        {status === "success" && (
          <CheckCircle className="text-green-500 w-5 h-5" />
        )}
        {(status === "generating" || status === "posting") && (
          <Loader2 className="animate-spin text-blue-500 w-5 h-5" />
        )}

        <span
          className={`text-sm font-medium ${
            status === "error"
              ? "text-red-600"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {message}
        </span>
      </div>

      {status === "success" && resultUrls.gist && (
        <div className="flex gap-2 ml-4">
          <a href={resultUrls.gist} target="_blank" rel="noopener noreferrer">
            <Badge
              variant="secondary"
              className="hover:bg-blue-100 cursor-pointer text-blue-700"
            >
              View Gist
            </Badge>
          </a>
          {/* If we had a direct tweet URL we'd show it, but current logic might just yield ID */}
        </div>
      )}
    </div>
  );
}
