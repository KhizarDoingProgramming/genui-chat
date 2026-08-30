import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeatherCard } from "@/components/generative-ui/WeatherCard";

describe("WeatherCard", () => {
  it("renders city and temperature", () => {
    render(
      <WeatherCard
        city="Tokyo"
        temperature={28}
        condition="sunny"
        humidity={65}
        windSpeed={12}
      />
    );
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("Weather")).toBeInTheDocument();
  });

  it("renders weather details", () => {
    render(
      <WeatherCard
        city="London"
        temperature={15}
        condition="rainy"
        humidity={80}
        windSpeed={20}
      />
    );
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("20 km/h")).toBeInTheDocument();
    expect(screen.getByText("rainy")).toBeInTheDocument();
  });

  it("renders forecast when provided", () => {
    render(
      <WeatherCard
        city="Paris"
        temperature={22}
        condition="cloudy"
        humidity={55}
        windSpeed={8}
        forecast={[
          { day: "Mon", high: 25, low: 18, condition: "sunny" },
          { day: "Tue", high: 20, low: 14, condition: "rainy" },
        ]}
      />
    );
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("25°")).toBeInTheDocument();
  });

  it("renders without forecast when not provided", () => {
    const { container } = render(
      <WeatherCard
        city="Berlin"
        temperature={10}
        condition="foggy"
        humidity={90}
        windSpeed={5}
      />
    );
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    // No forecast section
    expect(container.textContent).not.toContain("Mon");
  });
});
