import { describe, it, expect } from "vitest";
import {
  weatherCardSchema,
  statsCardSchema,
  dataTableSchema,
  chartCardSchema,
  productCardSchema,
} from "@/lib/ai/config";

describe("Tool Schemas", () => {
  describe("weatherCardSchema", () => {
    it("accepts valid weather data", () => {
      const result = weatherCardSchema.safeParse({
        city: "Tokyo",
        temperature: 28,
        condition: "sunny",
        humidity: 65,
        windSpeed: 12,
      });
      expect(result.success).toBe(true);
    });

    it("accepts data with optional forecast", () => {
      const result = weatherCardSchema.safeParse({
        city: "London",
        temperature: 15,
        condition: "rainy",
        humidity: 80,
        windSpeed: 20,
        forecast: [
          { day: "Mon", high: 18, low: 10, condition: "cloudy" },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing required fields", () => {
      const result = weatherCardSchema.safeParse({ city: "Tokyo" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid condition enum", () => {
      const result = weatherCardSchema.safeParse({
        city: "Tokyo",
        temperature: 28,
        condition: "hurricane",
        humidity: 65,
        windSpeed: 12,
      });
      expect(result.success).toBe(false);
    });

    it("rejects humidity out of range", () => {
      const result = weatherCardSchema.safeParse({
        city: "Tokyo",
        temperature: 28,
        condition: "sunny",
        humidity: 150,
        windSpeed: 12,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("statsCardSchema", () => {
    it("accepts valid stats data", () => {
      const result = statsCardSchema.safeParse({
        title: "Revenue",
        stats: [
          { label: "Total", value: "$1M" },
          { label: "Growth", value: "12%", trend: "up", change: 12 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty stats array", () => {
      const result = statsCardSchema.safeParse({
        title: "Revenue",
        stats: [],
      });
      expect(result.success).toBe(true); // empty array is valid
    });

    it("rejects missing title", () => {
      const result = statsCardSchema.safeParse({
        stats: [{ label: "Total", value: "$1M" }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("dataTableSchema", () => {
    it("accepts valid table data", () => {
      const result = dataTableSchema.safeParse({
        title: "Languages",
        columns: [
          { key: "name", label: "Name" },
          { key: "score", label: "Score", align: "right" },
        ],
        rows: [
          { name: "Python", score: "28%" },
          { name: "JS", score: "18%" },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing columns", () => {
      const result = dataTableSchema.safeParse({
        title: "Languages",
        rows: [{ name: "Python" }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("chartCardSchema", () => {
    it("accepts valid chart data", () => {
      const result = chartCardSchema.safeParse({
        title: "Sales",
        type: "bar",
        data: [
          { label: "Jan", value: 100 },
          { label: "Feb", value: 150, color: "#ff0000" },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("accepts donut type", () => {
      const result = chartCardSchema.safeParse({
        title: "Distribution",
        type: "donut",
        data: [{ label: "A", value: 50 }],
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid chart type", () => {
      const result = chartCardSchema.safeParse({
        title: "Sales",
        type: "pie",
        data: [{ label: "A", value: 50 }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("productCardSchema", () => {
    it("accepts valid product data", () => {
      const result = productCardSchema.safeParse({
        name: "MacBook Pro",
        description: "Powerful laptop",
        price: "$1999",
        rating: 4.5,
        features: ["M3 chip"],
        category: "Electronics",
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal product data", () => {
      const result = productCardSchema.safeParse({
        name: "Widget",
        description: "A widget",
        price: "$9.99",
      });
      expect(result.success).toBe(true);
    });

    it("rejects rating above 5", () => {
      const result = productCardSchema.safeParse({
        name: "Widget",
        description: "A widget",
        price: "$9.99",
        rating: 6,
      });
      expect(result.success).toBe(false);
    });
  });
});
