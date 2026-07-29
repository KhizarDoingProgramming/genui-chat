# Week 2 AI-Assisted Workflow Drill

This document outlines the disciplined AI-assisted development workflow used during the Week 2 phase of the FlyRank.ai Capstone project. The purpose is to reflect on the difference between vaguely prompting an AI for code generation versus precisely directing an AI to build robust, edge-case-aware features.

## 1. What was built
During this phase, we developed the core layout and Chat Interface logic for the application. The primary focus was on establishing a solid foundation for the AI messaging area (specifically handling the rendering of chat bubbles, avatars, and markdown) and auto-scrolling behaviors.

## 2. Vague Prompting vs. Precise Prompting
**Vague Prompting Approach:** 
Initially, a vague prompt was used: *"Build a chat interface in React with Tailwind."* The AI generated a very generic, unresponsive layout with absolute positioning that broke when the chat got too long. It lacked distinct visual cues for the user vs. assistant, did not handle auto-scrolling, and completely failed on mobile devices (e.g., overlapping input boxes).

**Precise Prompting Approach:** 
The prompt was then refined to be extremely precise: *"Build a responsive ChatContainer component in Next.js using Tailwind CSS. The container must use a flex-col h-screen layout. The chat messages should be mapped inside a scrollable area. The input must stick to the bottom without overlapping text. Assistant messages must parse markdown via react-markdown, and user messages must have a distinct background color. Ensure proper handling of empty states."*

## 3. Specific Differences in Implementation
- **Layout Architecture:** The vague implementation used `absolute bottom-0` for the input, causing the chat to render *underneath* the input area. The precise implementation correctly utilized a `flex-col h-full` structure with a `flex-1 overflow-y-auto` scrolling container for the messages.
- **Auto-scroll Logic:** The vague version lacked scrolling entirely. The precise prompt led to the integration of a `useRef` based auto-scroll hook that triggers on new messages, greatly improving the user experience.
- **Markdown Handling:** The precise implementation successfully implemented `react-markdown` and `remark-gfm` with custom styled components to handle code blocks gracefully without horizontal overflow.

## 4. AI Mistake Discovered & Corrected
During development, an AI mistake occurred when styling the chat input area. The AI suggested applying a Tailwind `.prose` class to the entire message container. This inadvertently caused the user's plain-text messages to inherit massive typography margins and max-width limitations, making the chat bubbles look deformed. 

**Correction Effort:** We reviewed the DOM structure, identified the conflicting `.prose` plugin styles, and manually refactored the `ChatMessage.tsx` component to conditionally apply `prose` *only* to the AI assistant's markdown output, keeping the user bubble restricted to standard tight paddings and borders.

## 5. Edge Cases & Accessibility Considerations
- **Empty State:** A polished empty state was added so users are not greeted with a blank screen.
- **Accessibility:** `aria-label` attributes were strictly enforced on buttons (like the Send icon), and contrast ratios for dark mode text were checked.
- **Scroll Edge Case:** We noticed that if a user manually scrolled up to read old messages, the arrival of a new streamed token would abruptly yank their viewport to the bottom. We implemented a threshold check (`isAtBottom`) so that auto-scrolling only occurs if the user is already near the bottom.

## 6. Future Workflow
Moving forward into Weeks 3 and 4, this strict, iterative process will be reused. Instead of asking the AI to "add streaming," we will define strict state flows (IDLE → SUBMITTING → STREAMING) and require explicit UI tests for abort signals, ensuring the capstone project remains production-quality.
