# Generative UI Chat

A production-ready AI chat application that goes beyond text. The AI understands your request and chooses the best way to present the answer — whether that's a chart, a data table, a statistics card, a weather display, or a product comparison. Every response is rendered through structured, validated UI components instead of raw text.

## Overview

Traditional chatbots return plain text for everything. Generative UI Chat uses the Vercel AI SDK's tool-calling system to let the AI decide when a structured visual component would communicate information better than markdown alone. The result is an interface that feels more like a native application than a chat window.

The application is built for developers and technical users who want to see AI-powered interfaces that are production-ready, not just demos.

## Features

- **Generative UI** — The AI selects from 5 structured component types (weather cards, statistics dashboards, data tables, charts, product cards) based on the user's request
- **Real-time streaming** — Responses stream token-by-token with smooth animation
- **Zod validation** — Every tool invocation is validated against a schema before rendering. Invalid data shows a safe error card, never raw model output
- **Retry with recovery** — Failed requests can be retried without losing conversation history. Mid-stream failures preserve partial content
- **Error classification** — Network errors, rate limits, server errors, and invalid requests each show a distinct, helpful message
- **Skeleton loading** — Animated placeholder content during initial streaming reduces perceived latency
- **Responsive design** — Works across 320px to desktop with mobile-optimized viewport handling, safe-area support, and keyboard-aware input
- **Dark/light mode** — System-aware theme with manual toggle
- **Accessible** — Keyboard navigation, focus-visible indicators, ARIA labels, skip-to-content link, semantic HTML

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| AI SDK | Vercel AI SDK 7 (`@ai-sdk/react`, `ai`) |
| AI Provider | Groq (`@ai-sdk/groq`) — Llama 3.1 8B |
| Validation | Zod 3 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Markdown | React Markdown + remark-gfm |
| Testing | Vitest + React Testing Library |

## Architecture

```
User types a message
       ↓
  Chat UI (React)
       ↓
  Next.js API Route (/api/chat)
       ↓
  AI Model (Groq / Llama 3.1)
       ↓
  Model returns structured tool call
       ↓
  Zod validates the tool arguments
       ↓
  UIGuard maps tool → trusted React component
       ↓
  Rendered response with interactive UI
```

### Key directories

```
src/
├── app/
│   ├── api/chat/route.ts       # AI API endpoint
│   ├── error.tsx                # Route-level error boundary
│   ├── global-error.tsx         # Root error boundary
│   ├── globals.css              # Design system tokens
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Main page
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx    # Main orchestrator (state, scroll, retry)
│   │   ├── ChatInput.tsx        # Auto-resizing textarea input
│   │   ├── ChatMessage.tsx      # Message rendering (markdown + tools)
│   │   ├── EmptyState.tsx       # Onboarding with example prompts
│   │   ├── ErrorBanner.tsx      # Classified error display with retry
│   │   ├── MessageSkeleton.tsx  # Loading skeleton during streaming
│   │   ├── ScrollToBottom.tsx   # Floating scroll button
│   │   ├── StopButton.tsx       # Abort generation button
│   │   └── ThinkingIndicator.tsx # Animated thinking dots
│   └── generative-ui/
│       ├── UIGuard.tsx          # Schema validation + component routing
│       ├── WeatherCard.tsx      # Weather display component
│       ├── StatsCard.tsx        # Statistics dashboard component
│       ├── DataTable.tsx        # Structured data table
│       ├── ChartCard.tsx        # Bar, horizontal-bar, donut charts
│       └── ProductCard.tsx      # Product information card
└── lib/
    ├── ai/config.ts             # AI model config, tool schemas, system prompt
    └── utils.ts                 # cn() utility
```

## AI Integration

### How it works

The application uses the Vercel AI SDK's tool-calling system. Five tools are defined with Zod schemas in `src/lib/ai/config.ts`:

| Tool | Purpose |
|------|---------|
| `generateWeatherCard` | Weather data for a city |
| `generateStatsCard` | KPI/numerical dashboard |
| `generateDataTable` | Ranked or tabular data |
| `generateChart` | Bar, horizontal-bar, or donut visualization |
| `generateProductCard` | Product comparison or recommendation |

The system prompt instructs the model on when to use each tool. When the model decides a tool is appropriate, it returns a structured JSON object matching the tool's schema. The AI SDK streams this to the client, where `UIGuard` validates it with Zod and renders the corresponding React component.

### Why structured tool calls are safer

The model never generates HTML, JSX, or executable code. It returns structured data (JSON matching a Zod schema). The frontend only renders predefined, trusted React components. If the model returns invalid data, Zod validation catches it and shows a safe error card.

### Configuration

All AI configuration is centralized in `src/lib/ai/config.ts`:
- Model selection
- System prompt
- Temperature and token limits
- Tool definitions with schemas

The API route (`src/app/api/chat/route.ts`) imports from this config — no inline prompts or model references.

## Local Setup

### Prerequisites

- Node.js 18+
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
git clone https://github.com/KhizarDoingProgramming/genui-chat.git
cd genui-chat
npm install
```

### Environment variables

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm run test
```

### What is tested

- **UIGuard** — Valid tool data renders correct components. Invalid data is rejected safely. Unknown tools show a graceful fallback.
- **ErrorBanner** — Error messages are classified (rate limit, network, server, unknown). Retry button calls the correct handler. Disabled state during retry.
- **ChatInput** — Empty/whitespace input is prevented. Disabled during loading. Form submission works.
- **EmptyState** — All 4 example prompts render. Clicking sends the prompt.
- **Tool Schemas** — All 5 Zod schemas validate correct data and reject invalid data.
- **ChartCard** — Bar, horizontal-bar, and donut charts render with correct data.
- **WeatherCard** — City, temperature, details, and forecast render correctly.
- **StatsCard** — Title, stats, trends, and descriptions render.

### Coverage

```bash
npm run test:coverage
```

Target: ≥50% line coverage across components and lib.

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repository in [vercel.com/new](https://vercel.com/new)
3. Add the `GROQ_API_KEY` environment variable
4. Deploy

Vercel automatically:
- Runs the production build
- Serves the API route as a serverless function
- Handles HTTPS and edge caching

### Rollback

If a deployment has issues:
1. Revert the problematic commit: `git revert HEAD`
2. Push: `git push`
3. Vercel automatically deploys the corrected `main` branch

## Error Handling

| Error type | What the user sees | Recovery |
|-----------|-------------------|----------|
| Network failure | "Connection lost" banner | Retry button |
| Rate limit (429) | "Service is busy" banner | Retry button |
| Server error (5xx) | "Server error" banner | Retry button |
| Invalid request (400) | "Invalid request" banner | Retry button |
| Mid-stream failure | "Interrupted" banner (amber) + preserved partial content | Retry regenerates from last user message |
| Invalid tool data | Safe error card within the message | Chat remains functional |
| Unknown tool | "Not supported yet" card | Chat remains functional |

Retry uses the AI SDK's `regenerate()` method, which re-sends the last user message without duplicating it or losing conversation history.

## Accessibility

- **Keyboard navigation** — All interactive elements are reachable via Tab
- **Focus visibility** — `focus-visible` outline ring on all buttons and interactive elements
- **ARIA labels** — Send, stop, retry, scroll, and theme toggle buttons have descriptive labels
- **Skip-to-content** — Skip link allows keyboard users to jump past the header
- **Semantic HTML** — Proper heading hierarchy, form labels, button roles
- **Error communication** — Errors use icon + text, not color alone
- **Disabled states** — Buttons are properly disabled and communicate state
- **Responsive** — Tested at 320px, 375px, 390px, 430px, and desktop widths

## Security

- API keys are never exposed to the client (`GROQ_API_KEY` has no `NEXT_PUBLIC_` prefix)
- `.env*` files are gitignored
- Model output is never executed as JavaScript or rendered as raw JSX
- All tool arguments are validated with Zod before rendering
- Error messages do not expose stack traces, API keys, or internal details
- Development sabotage controls are hidden in production builds

## Known Limitations

- AI-generated data is model-produced, not fetched from live external APIs (weather, sales data, etc. are illustrative)
- No conversation persistence — refreshing the page starts a new chat
- No authentication or user accounts
- The Groq free tier has rate limits that may affect heavy usage
- Charts are pure CSS/SVG — no interactive tooltips or click handlers

## Future Improvements

- Conversation persistence (localStorage or database)
- Message editing, copying, and deletion
- Syntax highlighting in code blocks
- File/image upload support
- Multi-conversation support
- Streaming progress indicators for long tool calls
- Additional tool types (maps, code execution, etc.)

## Author

Built by [KhizarDoingProgramming](https://github.com/KhizarDoingProgramming) for the Flyrank.ai Capstone.
