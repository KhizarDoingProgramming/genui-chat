# AI Development Rules for FlyRank.ai Capstone

These are the strict, testable project-specific rules for AI-assisted development on this codebase.

## 1. Centralized AI Configuration
**Rule:** All AI model configuration (model selection, system prompts, max tokens, temperature) must remain strictly encapsulated inside `src/lib/ai/config.ts`.
**Testable Validation:** No references to `groq` or `openrouter` provider imports or inline system prompts are permitted inside `src/app/api/chat/route.ts` or any other route handlers. The route handler must import these values directly from the config module.

## 2. Environment Variable Security
**Rule:** API secrets for AI providers must never be prefixed with `NEXT_PUBLIC_` and must never be exposed to the client bundle.
**Testable Validation:** A search of the codebase for `NEXT_PUBLIC_OPENROUTER_API_KEY` or `process.env.NEXT_PUBLIC` regarding API keys must return zero results. The `OPENROUTER_API_KEY` must only be accessed within server-side environments (e.g., `route.ts`).

## 3. Graceful Auto-Scroll Behavior
**Rule:** The chat auto-scroll logic must not forcefully scroll the viewport to the bottom if the user has intentionally scrolled up to read previous messages while a generation is in progress.
**Testable Validation:** The `ChatContainer.tsx` component must maintain an `isAtBottom` state threshold. If `isAtBottom` evaluates to false, incoming streamed tokens must not trigger `scrollTo()`.

## 4. Preservation of Partial Generations
**Rule:** When a user aborts an AI generation by clicking the "Stop" button, the already-streamed partial assistant response must be preserved in the message history, and the input must be immediately unlocked for the next prompt.
**Testable Validation:** Stopping the `useChat()` hook during a stream must append the partial string to the active message array rather than deleting the final message index.

## 5. Client vs. Server Components
**Rule:** Interactive components (e.g., `ChatContainer`, `ChatInput`) must be explicitly marked with `"use client"` directives at the top of the file, while layout and health check pages must remain default Server Components.
**Testable Validation:** `src/app/page.tsx` and `src/app/health/page.tsx` must not contain `"use client"` directives unless absolutely necessary for interactivity.
