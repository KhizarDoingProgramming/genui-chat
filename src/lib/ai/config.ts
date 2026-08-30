import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { zodSchema } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const weatherCardSchema = z.object({
  city: z.string().describe("The city name"),
  temperature: z.number().describe("Current temperature in Celsius"),
  condition: z.enum(["sunny", "cloudy", "rainy", "stormy", "snowy", "windy", "foggy"]).describe("Weather condition"),
  humidity: z.number().min(0).max(100).describe("Humidity percentage"),
  windSpeed: z.number().describe("Wind speed in km/h"),
  forecast: z.array(z.object({
    day: z.string(),
    high: z.number(),
    low: z.number(),
    condition: z.enum(["sunny", "cloudy", "rainy", "stormy", "snowy", "windy", "foggy"]),
  })).optional().describe("3-day forecast if available"),
});

export const statsCardSchema = z.object({
  title: z.string().describe("Title of the statistics card"),
  description: z.string().optional().describe("Brief description of what the stats represent"),
  stats: z.array(z.object({
    label: z.string().describe("Name of the metric"),
    value: z.string().describe("Formatted value of the metric"),
    change: z.number().optional().describe("Percentage change (positive or negative)"),
    trend: z.enum(["up", "down", "neutral"]).optional().describe("Trend direction"),
  })).describe("Array of statistical metrics"),
});

export const dataTableSchema = z.object({
  title: z.string().describe("Title for the data table"),
  columns: z.array(z.object({
    key: z.string(),
    label: z.string(),
    align: z.enum(["left", "center", "right"]).optional(),
  })).describe("Column definitions"),
  rows: z.array(z.record(z.string(), z.string())).describe("Table row data as key-value objects"),
});

export const chartCardSchema = z.object({
  title: z.string().describe("Chart title"),
  type: z.enum(["bar", "horizontal-bar", "donut"]).describe("Chart visualization type"),
  data: z.array(z.object({
    label: z.string(),
    value: z.number(),
    color: z.string().optional(),
  })).describe("Data points for the chart"),
});

export const productCardSchema = z.object({
  name: z.string().describe("Product name"),
  description: z.string().describe("Product description"),
  price: z.string().describe("Formatted price string"),
  rating: z.number().min(0).max(5).optional().describe("Rating out of 5"),
  features: z.array(z.string()).optional().describe("Key product features"),
  category: z.string().optional().describe("Product category"),
});

export const aiTools = {
  generateWeatherCard: {
    description: "Generate an interactive weather information card for a specific city. Use this when the user asks about weather, temperature, or climate conditions.",
    inputSchema: zodSchema(weatherCardSchema),
  },
  generateStatsCard: {
    description: "Generate a statistics dashboard card with multiple metrics. Use this for displaying numerical data, KPIs, comparisons, or any quantitative information.",
    inputSchema: zodSchema(statsCardSchema),
  },
  generateDataTable: {
    description: "Generate a structured data table. Use this for comparing items, listing ranked data, or displaying any tabular information.",
    inputSchema: zodSchema(dataTableSchema),
  },
  generateChart: {
    description: "Generate a chart visualization. Use this for showing distributions, comparisons, proportions, or trends in data.",
    inputSchema: zodSchema(chartCardSchema),
  },
  generateProductCard: {
    description: "Generate a product information card. Use this when discussing products, recommendations, comparisons, or shopping-related queries.",
    inputSchema: zodSchema(productCardSchema),
  },
};

export type WeatherCardArgs = z.infer<typeof weatherCardSchema>;
export type StatsCardArgs = z.infer<typeof statsCardSchema>;
export type DataTableArgs = z.infer<typeof dataTableSchema>;
export type ChartCardArgs = z.infer<typeof chartCardSchema>;
export type ProductCardArgs = z.infer<typeof productCardSchema>;

export const aiConfig = {
  model: openrouter.chat("meta-llama/llama-3.1-8b-instruct:free"),
  
  temperature: 0.7,
  maxOutputTokens: 2000,
  
  systemPrompt: `You are a helpful, intelligent, and friendly AI assistant powered by advanced generative UI.

CAPABILITIES:
- You can respond with text using markdown formatting (headers, lists, bold, italic, code blocks, tables).
- You have access to interactive UI tools that let you create rich visual components inline.

WHEN TO USE TOOLS:
- Weather queries → use generateWeatherCard
- Statistics, numbers, KPIs, comparisons → use generateStatsCard
- Tabular data, rankings, lists with multiple attributes → use generateDataTable
- Charts, distributions, proportions → use generateChart
- Product recommendations, comparisons → use generateProductCard

RULES:
- Always provide a brief text explanation alongside tool-generated UI.
- Use markdown for text formatting. When providing code snippets, specify the language.
- Be concise but informative.
- When data is uncertain or estimated, note that clearly.
- You may use multiple tools in a single response if appropriate.
- Always call tools with complete, realistic data — never use placeholder values.`,
};
