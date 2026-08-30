import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartCard } from "@/components/generative-ui/ChartCard";

describe("ChartCard", () => {
  it("renders bar chart with title", () => {
    render(
      <ChartCard
        title="Monthly Revenue"
        type="bar"
        data={[
          { label: "Jan", value: 100 },
          { label: "Feb", value: 200 },
        ]}
      />
    );
    expect(screen.getByText("Monthly Revenue")).toBeInTheDocument();
    expect(screen.getByText("Visualization")).toBeInTheDocument();
  });

  it("renders horizontal bar chart", () => {
    render(
      <ChartCard
        title="Language Popularity"
        type="horizontal-bar"
        data={[
          { label: "Python", value: 28 },
          { label: "JavaScript", value: 18 },
        ]}
      />
    );
    expect(screen.getByText("Language Popularity")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("renders donut chart with total", () => {
    render(
      <ChartCard
        title="Market Share"
        type="donut"
        data={[
          { label: "Chrome", value: 65 },
          { label: "Firefox", value: 15 },
          { label: "Safari", value: 20 },
        ]}
      />
    );
    expect(screen.getByText("Market Share")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument(); // total
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Firefox")).toBeInTheDocument();
    expect(screen.getByText("Safari")).toBeInTheDocument();
  });

  it("renders data values in bar chart", () => {
    render(
      <ChartCard
        title="Sales"
        type="bar"
        data={[{ label: "Q1", value: 500 }]}
      />
    );
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders percentage labels in donut chart", () => {
    render(
      <ChartCard
        title="Distribution"
        type="donut"
        data={[
          { label: "A", value: 75 },
          { label: "B", value: 25 },
        ]}
      />
    );
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
  });
});
