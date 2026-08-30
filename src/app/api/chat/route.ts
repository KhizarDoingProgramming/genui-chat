import { streamText, convertToModelMessages } from 'ai';
import { aiConfig, aiTools } from '@/lib/ai/config';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sabotageMode = process.env.NODE_ENV === "development"
      ? req.headers.get("x-dev-sabotage")
      : null;

    if (sabotageMode === "immediate") {
      return new Response(
        JSON.stringify({ error: "Simulated API failure (dev sabotage)." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (sabotageMode === "rate-limit") {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "5",
          },
        }
      );
    }

    const result = await streamText({
      model: aiConfig.model,
      system: aiConfig.systemPrompt,
      messages: await convertToModelMessages(messages),
      temperature: aiConfig.temperature,
      maxOutputTokens: aiConfig.maxOutputTokens,
      tools: aiTools,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    console.error("Error name:", error instanceof Error ? error.name : "unknown");
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    if (error && typeof error === "object" && "cause" in error) {
      console.error("Error cause:", error.cause);
    }

    const message = error instanceof Error ? error.message : "";

    if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "5",
          },
        }
      );
    }

    if (message.includes("400") || message.toLowerCase().includes("invalid")) {
      return new Response(
        JSON.stringify({ error: "Invalid request." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "An error occurred during generation." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
