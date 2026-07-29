import { groq } from "@ai-sdk/groq";

export const aiConfig = {
  model: groq("llama-3.1-8b-instant") as any,
  
  temperature: 0.7,
  maxTokens: 2000,
  
  systemPrompt: `You are a helpful, intelligent, and friendly AI assistant.
You provide clear, accurate, and concise answers.
Use markdown for formatting. 
When providing code snippets, always specify the language.
Be polite and professional.`,
};
