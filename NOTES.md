# Task: Generative UI Chat Application

## What Was Built

Transformed the existing AI chat interface into a proper **Generative UI** chat application where the AI can decide when to respond with interactive UI components instead of only text.

## Architecture

### Tool-Calling System
Defined 5 Zod-validated tool schemas in `src/lib/ai/config.ts`:
- **generateWeatherCard** — Weather display with city, temperature, conditions, forecast
- **generateStatsCard** — KPI dashboard grid with trend indicators
- **generateDataTable** — Structured table with column definitions and striped rows
- **generateChart** — Bar, horizontal-bar, and donut chart visualizations (pure SVG/CSS)
- **generateProductCard** — Product display with ratings, features, category

### Security
- Model output is **never** rendered as JSX/HTML
- Every tool invocation is validated against Zod schemas before rendering
- Invalid data shows a safe error card, not raw model output
- Tool components are hardcoded in a registry — model cannot inject arbitrary components

### Component Registry (`UIGuard.tsx`)
Maps tool names to trusted React components. Handles three states:
- `call` / `partial-call` → Shows animated pending spinner
- `result` → Validates args with Zod, renders the appropriate component
- Unknown tools → Shows graceful fallback

### API Route (`src/app/api/chat/route.ts`)
- Registers all 5 tools with `streamText()`
- Uses AI SDK v7 `DefaultChatTransport` on the client
- Tools execute server-side, structured data streams to client

### Message Rendering (`ChatMessage.tsx`)
- Extracts text parts and tool invocation parts from messages
- Renders text with markdown, tool UIs in a `not-prose` container below
- Each tool invocation is independently validated and rendered

## Dependencies
- **Zod** — Added as direct dependency for tool schema validation (was transitive via AI SDK)
- All other tools use existing stack: Framer Motion, Lucide, Tailwind, React Markdown

## What Already Works
- Streaming text responses with markdown
- Tool calling — AI automatically calls appropriate tools based on user queries
- 5 generative UI components with entrance animations
- Dark/light theme, responsive design, auto-scroll, stop generation
- Clean lint + TypeScript build with zero errors

## Files Modified
- `src/lib/ai/config.ts` — Zod schemas, tool registry, updated system prompt
- `src/app/api/chat/route.ts` — Tool registration, maxOutputTokens
- `src/components/chat/ChatContainer.tsx` — DefaultChatTransport, tool part extraction
- `src/components/chat/ChatMessage.tsx` — Renders tool invocations alongside text
- `src/components/ThemeToggle.tsx` — Fixed React 19 lint error
- `src/app/page.tsx` — Import ordering fix
- `package.json` — Added zod dependency

## Files Created
- `src/components/generative-ui/UIGuard.tsx` — Tool validation and component mapping
- `src/components/generative-ui/WeatherCard.tsx`
- `src/components/generative-ui/StatsCard.tsx`
- `src/components/generative-ui/DataTable.tsx`
- `src/components/generative-ui/ChartCard.tsx`
- `src/components/generative-ui/ProductCard.tsx`
