"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { StopButton } from "./StopButton";
import { ScrollToBottom } from "./ScrollToBottom";
import { ThemeToggle } from "../ThemeToggle";
import { MessageSkeleton } from "./MessageSkeleton";
import { ErrorBanner } from "./ErrorBanner";
import { EmptyState } from "./EmptyState";

function getSabotageHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const mode = localStorage.getItem("dev-sabotage-mode");
    if (mode && mode !== "off") {
      return { "x-dev-sabotage": mode };
    }
  } catch {
    // localStorage unavailable
  }
  return {};
}

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
  headers: getSabotageHeader,
});

export function ChatContainer() {
  const { messages, status, stop, sendMessage, error, regenerate, clearError } = useChat({
    transport: chatTransport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const [input, setInput] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    clearError();
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
  }, [input, isLoading, sendMessage, clearError]);

  const handleExampleClick = useCallback((prompt: string) => {
    if (isLoading) return;
    clearError();
    sendMessage({ role: "user", parts: [{ type: "text", text: prompt }] });
  }, [isLoading, sendMessage, clearError]);

  const handleRetry = useCallback(async () => {
    if (isRetrying || isLoading) return;
    setIsRetrying(true);
    clearError();
    try {
      await regenerate();
    } catch {
      // Error is handled by useChat's error state
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying, isLoading, regenerate, clearError]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(atBottom);
    }
  }, []);

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isAtBottom]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
      setIsAtBottom(true);
    }
  }, []);

  const isStreaming = isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const isThinking = isLoading && (!messages.length || messages[messages.length - 1].role === "user");

  const hasPartialContent = error && messages.length > 0 && messages[messages.length - 1].role === "assistant";

  return (
    <div className="flex flex-col h-full bg-background text-foreground transition-colors duration-200">

      <header className="flex-none flex items-center justify-between p-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg px-3 py-1.5 rounded-lg hover:bg-muted cursor-pointer transition-colors flex items-center gap-2">
            Assistant
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto w-full pt-6 pb-6"
      >
        <div className="w-full max-w-3xl mx-auto px-4 md:px-0">
          {messages.length === 0 && !isLoading ? (
            <EmptyState onExampleClick={handleExampleClick} />
          ) : (
            <div className="flex flex-col space-y-4">
              {messages.map((m) => {
                const textContent = m.parts?.filter(p => p.type === "text").map(p => p.text).join("") || "";
                const toolInvocations = m.parts?.filter(
                  (p): p is Extract<typeof p, { type: "tool-invocation" }> => p.type === "tool-invocation"
                );
                return (
                  <ChatMessage
                    key={m.id}
                    role={m.role}
                    content={textContent}
                    toolInvocations={toolInvocations?.length ? toolInvocations : undefined}
                  />
                );
              })}

              {isThinking && (
                <div className="py-4 flex items-start w-full">
                   <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-border mr-4">
                      <div className="w-4 h-4 rounded-full bg-foreground animate-pulse" />
                   </div>
                  <ThinkingIndicator />
                </div>
              )}

              {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].parts?.filter(p => p.type === "text").map(p => p.text).join("") === "" && (
                <MessageSkeleton />
              )}
            </div>
          )}
        </div>
      </main>

      <div className="flex-none w-full max-w-3xl mx-auto px-4 pb-6 pt-2 relative">
        <ScrollToBottom isVisible={!isAtBottom} onClick={scrollToBottom} />

        <ErrorBanner
          error={error}
          isRetrying={isRetrying}
          hasPartialContent={!!hasPartialContent}
          onRetry={handleRetry}
        />

        {isStreaming && <StopButton onClick={stop} />}
        <div className="w-full relative group">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}
