import { streamText, convertToModelMessages } from 'ai';
import { aiConfig, aiTools } from '@/lib/ai/config';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
    return new Response(JSON.stringify({ error: "An error occurred during generation." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
