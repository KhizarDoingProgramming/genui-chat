"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground h-dvh flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground text-sm mb-6">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
