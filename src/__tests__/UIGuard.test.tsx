import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UIGuard } from "@/components/generative-ui/UIGuard";

function makeInvocation(overrides: Partial<{
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}> = {}) {
  return {
    type: "tool-invocation" as const,
    toolCallId: overrides.toolCallId ?? "test-id",
    toolName: overrides.toolName ?? "generateWeatherCard",
    args: overrides.args ?? {},
    state: overrides.state ?? "result",
  };
}

describe("UIGuard", () => {
  describe("pending states", () => {
    it("shows spinner for call state", () => {
      render(<UIGuard invocation={makeInvocation({ state: "call" })} />);
      expect(screen.getByText(/Generating Weather Card/i)).toBeInTheDocument();
    });

    it("shows spinner for partial-call state", () => {
      render(<UIGuard invocation={makeInvocation({ state: "partial-call" })} />);
      expect(screen.getByText(/Generating Weather Card/i)).toBeInTheDocument();
    });
  });

  describe("valid tool data", () => {
    it("renders WeatherCard with valid data", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateWeatherCard",
            args: {
              city: "Tokyo",
              temperature: 28,
              condition: "sunny",
              humidity: 65,
              windSpeed: 12,
            },
          })}
        />
      );
      expect(screen.getByText("Tokyo")).toBeInTheDocument();
      expect(screen.getByText("28")).toBeInTheDocument();
      expect(screen.getByText("Weather")).toBeInTheDocument();
    });

    it("renders StatsCard with valid data", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateStatsCard",
            args: {
              title: "Revenue Overview",
              stats: [
                { label: "Revenue", value: "$1.2M", trend: "up" },
                { label: "Users", value: "48K", trend: "down" },
              ],
            },
          })}
        />
      );
      expect(screen.getByText("Revenue Overview")).toBeInTheDocument();
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("$1.2M")).toBeInTheDocument();
    });

    it("renders DataTable with valid data", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateDataTable",
            args: {
              title: "Language Rankings",
              columns: [
                { key: "name", label: "Language" },
                { key: "popularity", label: "Popularity" },
              ],
              rows: [
                { name: "Python", popularity: "28%" },
                { name: "JavaScript", popularity: "18%" },
              ],
            },
          })}
        />
      );
      expect(screen.getByText("Language Rankings")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
    });

    it("renders ChartCard with valid data", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateChart",
            args: {
              title: "Monthly Sales",
              type: "bar",
              data: [
                { label: "Jan", value: 100 },
                { label: "Feb", value: 150 },
              ],
            },
          })}
        />
      );
      expect(screen.getByText("Monthly Sales")).toBeInTheDocument();
      expect(screen.getByText("Jan")).toBeInTheDocument();
      expect(screen.getByText("Feb")).toBeInTheDocument();
    });

    it("renders ProductCard with valid data", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateProductCard",
            args: {
              name: "MacBook Pro",
              description: "A powerful laptop",
              price: "$1999",
              rating: 4.5,
              features: ["M3 chip", "16GB RAM"],
              category: "Electronics",
            },
          })}
        />
      );
      expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
      expect(screen.getByText("A powerful laptop")).toBeInTheDocument();
      expect(screen.getByText("$1999")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();
    });
  });

  describe("invalid tool data", () => {
    it("shows validation error for invalid weather data", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateWeatherCard",
            args: { city: 123 }, // missing required fields, wrong types
          })}
        />
      );
      expect(screen.getByText(/Failed to render/i)).toBeInTheDocument();
    });

    it("shows validation error for invalid stats data", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateStatsCard",
            args: { title: 42 }, // wrong type
          })}
        />
      );
      expect(screen.getByText(/Failed to render/i)).toBeInTheDocument();
    });
  });

  describe("unknown tools", () => {
    it("shows fallback for unknown tool name", () => {
      render(
        <UIGuard
          invocation={makeInvocation({
            toolName: "generateUnknownThing",
          })}
        />
      );
      expect(screen.getByText(/not supported yet/i)).toBeInTheDocument();
    });
  });
});
