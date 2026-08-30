import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HealthCheckPage() {
  const requestHeaders = await headers();
  const timestamp = new Date().toISOString();
  const hasApiKey = !!process.env.OPENROUTER_API_KEY;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          System Health
        </h1>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-green-600 dark:text-green-400">Operational</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Timestamp</span>
            <span className="font-mono text-xs">{timestamp}</span>
          </div>

          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <span className="text-muted-foreground">AI Configuration</span>
            <span className="font-medium">
              {hasApiKey ? "Configured ✓" : "Missing API Key ✗"}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2">
            <span className="text-muted-foreground">User Agent</span>
            <span className="font-mono text-xs truncate ml-4 max-w-[200px]" title={requestHeaders.get("user-agent") || "Unknown"}>
              {requestHeaders.get("user-agent") || "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
