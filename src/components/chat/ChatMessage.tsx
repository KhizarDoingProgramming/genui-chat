"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { UIGuard } from "../generative-ui/UIGuard";
interface ChatMessageProps {
  role: string;
  content: string;
  toolInvocations?: Array<{
    type: "tool-invocation";
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    state: "call" | "partial-call" | "result";
    result?: unknown;
  }>;
}

export function ChatMessage({ role, content, toolInvocations }: ChatMessageProps) {
  const isUser = role === "user";
  const hasToolCalls = !isUser && toolInvocations && toolInvocations.length > 0;
  const hasText = content.trim().length > 0;

  return (
    <div className={cn("w-full flex py-4 md:py-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%]", 
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {!isUser && (
          <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 mr-4 bg-white dark:bg-zinc-900 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-900 dark:text-zinc-100"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        )}

        <div className={cn(
          "break-words flex flex-col gap-3",
          isUser 
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-5 py-2.5 rounded-3xl text-[15px]" 
            : "text-foreground prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none text-[15px]"
        )}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <>
              {hasText && (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ children: preChildren, ...props }) => (
                      <div className="overflow-hidden rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800/80 my-4 shadow-sm w-full">
                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 dark:bg-zinc-950/80 border-b border-zinc-800/50 text-xs text-zinc-400">
                          <span className="font-mono">code</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[13px] leading-6 text-zinc-50 m-0 bg-transparent" {...props}>
                          {preChildren}
                        </pre>
                      </div>
                    ),
                    code: ({ className, children: codeChildren, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match && !className;
                      if (isInline) {
                        return <code className="px-1.5 py-0.5 mx-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[13px] font-mono text-zinc-900 dark:text-zinc-200" {...props}>{codeChildren}</code>;
                      }
                      return <code className={className} {...props}>{codeChildren}</code>;
                    },
                    p: ({ children: pChildren, ...props }) => (
                      <p className="mb-4 last:mb-0" {...props}>{pChildren}</p>
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              )}
              {hasToolCalls && (
                <div className="flex flex-col gap-3 not-prose">
                  {toolInvocations!.map((invocation) => (
                    <UIGuard key={invocation.toolCallId} invocation={invocation} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
