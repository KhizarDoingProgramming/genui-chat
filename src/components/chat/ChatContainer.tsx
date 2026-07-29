"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { StopButton } from "./StopButton";
import { ScrollToBottom } from "./ScrollToBottom";
import { ThemeToggle } from "../ThemeToggle";

export function ChatContainer() {
  const { messages, status, stop, sendMessage } = useChat({
    api: "/api/chat",
  } as any);

  const isLoading = status === "submitted" || status === "streaming";

  const [input, setInput] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(atBottom);
    }
  };

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isAtBottom]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
      setIsAtBottom(true);
    }
  };

  const isStreaming = isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const isThinking = isLoading && (!messages.length || messages[messages.length - 1].role === "user");

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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground">Type a message below to start chatting.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {messages.map((m) => {
                const textContent = m.parts?.map(p => p.type === 'text' ? p.text : '').join('') || (m as any).content || "";
                return <ChatMessage key={m.id} role={m.role} content={textContent} />
              })}
              

              {isThinking && (
                <div className="py-4 flex items-start w-full">
                   <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-border mr-4">
                      <div className="w-4 h-4 rounded-full bg-foreground animate-pulse" />
                   </div>
                  <ThinkingIndicator />
                </div>
              )}
            </div>
          )}
        </div>
      </main>


      <div className="flex-none w-full max-w-3xl mx-auto px-4 pb-6 pt-2 relative">
        <ScrollToBottom isVisible={!isAtBottom} onClick={scrollToBottom} />
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
