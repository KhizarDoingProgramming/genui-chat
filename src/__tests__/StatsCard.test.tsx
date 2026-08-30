import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "@/components/generative-ui/StatsCard";

describe("StatsCard", () => {
  it("renders title and stats", () => {
    render(
      <StatsCard
        title="Revenue Overview"
        stats={[
          { label: "Revenue", value: "$1.2M" },
          { label: "Users", value: "48K" },
        ]}
      />
    );
    expect(screen.getByText("Revenue Overview")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$1.2M")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("48K")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <StatsCard
        title="Q4 Results"
        description="Last quarter performance"
        stats={[{ label: "Sales", value: "1000" }]}
      />
    );
    expect(screen.getByText("Last quarter performance")).toBeInTheDocument();
  });

  it("renders trend indicators", () => {
    render(
      <StatsCard
        title="Metrics"
        stats={[
          { label: "Up", value: "100", trend: "up", change: 12 },
          { label: "Down", value: "50", trend: "down", change: -5 },
        ]}
      />
    );
    expect(screen.getByText("Up")).toBeInTheDocument();
    expect(screen.getByText("Down")).toBeInTheDocument();
  });

  it("renders Statistics label", () => {
    render(
      <StatsCard
        title="Test"
        stats={[{ label: "A", value: "1" }]}
      />
    );
    expect(screen.getByText("Statistics")).toBeInTheDocument();
  });
});
