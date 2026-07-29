# AI Chat Interface

A modern, responsive, and highly polished AI chat application built with Next.js, React, Tailwind CSS v4, and the Vercel AI SDK.

## Features

- **Real-time AI Streaming**: Implements the Vercel AI SDK to stream responses from Groq instantly, creating a smooth and seamless chat experience.
- **Modern UI/UX**: A clean, premium chat interface inspired by industry-leading AI chat apps (like ChatGPT and Claude) featuring responsive design, chat bubbles, thinking indicators, and a sticky "pill" chat input.
- **Markdown & Code Support**: Full support for rendering Markdown content natively, with custom syntax-highlighted code blocks perfectly embedded into the chat bubbles.
- **Mobile Responsive**: Fully optimized for mobile screens and fluid resizing.
- **Dark & Light Mode**: Built-in support for theme toggling using `next-themes`.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Markdown**: `react-markdown`, `remark-gfm`
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env.local` file and add your AI API key:
   ```env
   GROQ_API_KEY=your_groq_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Author

Built by [KhizarDoingProgramming](https://github.com/KhizarDoingProgramming) for the Flyrank.ai Week 4 Internship.
