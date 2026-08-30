# Flyrank.ai — Final Capstone: Generative UI Chat

## Project
A production-ready AI chat application where the model selects the best visual component (chart, table, statistics card, weather display, product comparison) to present information — not just raw text. Built for Flyrank.ai's internship capstone.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5 (strict)
- Tailwind CSS 4
- Vercel AI SDK 7 (`@ai-sdk/react`, `ai`)
- Groq (`@ai-sdk/groq`) — Llama 3.1 8B
- Zod 3 (schema validation)
- Framer Motion 12
- Vitest + React Testing Library

## Features
- Real-time token-by-token streaming
- 5 generative UI tools: weather, stats, data table, chart, product card
- Zod validation — invalid AI output is rejected, never rendered as JSX
- Error classification — network, rate limit, server, invalid request each show distinct messages
- Retry with `regenerate()` — preserves conversation history, no duplicate messages
- Mid-stream failure handling — partial content is kept, input unlocked immediately
- Skeleton loading, stop button, scroll-to-bottom
- Dark/light mode with system preference detection
- Mobile responsive (320px+), safe-area support, keyboard-aware input
- Accessibility: focus-visible rings, skip-to-content, ARIA labels, semantic HTML

## AI Architecture
```
User message → Next.js API Route → Groq model (Llama 3.1 8B)
    → Model returns structured tool call (JSON)
    → Zod validates arguments
    → UIGuard maps tool → trusted React component
    → Rendered UI in chat
```

All AI config centralized in `src/lib/ai/config.ts`. Route handler imports from config — no inline prompts or model references.

## Security
- `GROQ_API_KEY` has no `NEXT_PUBLIC_` prefix — never exposed to client
- `.env*` files gitignored
- Model output is never executed as JS or rendered as raw JSX
- Error messages don't expose stack traces, keys, or internal details
- Dev sabotage controls hidden in production

## Testing
- 8 test files, 58 tests, 53% line coverage
- Covers: UIGuard, ErrorBanner, ChatInput, EmptyState, 5 Zod schemas, ChartCard, WeatherCard, StatsCard
- `npm run test` / `npm run test:coverage`

## What Was Done (Capstone Pass)
1. Installed Vitest, React Testing Library, jsdom, @vitejs/plugin-react
2. Wrote 8 test suites covering all major components and schemas
3. Added accessibility fixes: focus-visible, ARIA labels, skip-to-content
4. Rewrote README with full documentation
5. Security review — confirmed no secrets exposed, no unsafe rendering
6. Lint, build, tests — all pass clean
7. Committed and pushed to `main`

## Deployment
- Vercel — automatic from `main` branch
- Set `GROQ_API_KEY` in Vercel environment variables
- Rollback: `git revert HEAD` → `git push`

## Known Limitations
- AI-generated data is model-produced, not live API data
- No conversation persistence across page refreshes
- No authentication
- Groq free tier rate limits (~30 req/min)
- Charts are CSS/SVG — no interactive tooltips

## Future Improvements
- Conversation persistence (localStorage or database)
- Message editing, copying, deletion
- Code syntax highlighting
- File/image upload
- Multi-conversation support
- Additional tool types (maps, code execution)
