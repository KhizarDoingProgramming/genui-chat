"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="chat-input"
      className="flex flex-row items-end w-full bg-zinc-100 dark:bg-zinc-800 rounded-[26px] border border-zinc-200 dark:border-zinc-700/80 shadow-sm"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
        placeholder="Message Assistant..."
        className="w-full resize-none bg-transparent outline-none border-0 focus:ring-0 px-5 py-4 max-h-[200px] text-[15px] scrollbar-hide text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
        rows={1}
        style={{ minHeight: "56px" }}
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <div className="p-2 shrink-0">
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={isLoading ? "Sending..." : "Send message"}
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
