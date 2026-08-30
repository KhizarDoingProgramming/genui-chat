import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "@/components/chat/EmptyState";

describe("EmptyState", () => {
  it("renders welcome heading", () => {
    render(<EmptyState onExampleClick={vi.fn()} />);
    expect(screen.getByText("How can I help you today?")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<EmptyState onExampleClick={vi.fn()} />);
    expect(screen.getByText(/Ask me anything/)).toBeInTheDocument();
  });

  it("renders all four example prompts", () => {
    render(<EmptyState onExampleClick={vi.fn()} />);
    expect(screen.getByText("Show me the top programming languages.")).toBeInTheDocument();
    expect(screen.getByText("Create a chart of monthly sales.")).toBeInTheDocument();
    expect(screen.getByText("Compare React and Vue.")).toBeInTheDocument();
    expect(screen.getByText("What's the weather in Tokyo?")).toBeInTheDocument();
  });

  it("calls onExampleClick with the correct prompt when an example is clicked", async () => {
    const user = userEvent.setup();
    const onExampleClick = vi.fn();
    render(<EmptyState onExampleClick={onExampleClick} />);
    await user.click(screen.getByText("What's the weather in Tokyo?"));
    expect(onExampleClick).toHaveBeenCalledWith("What's the weather in Tokyo?");
  });

  it("calls onExampleClick for each example", async () => {
    const user = userEvent.setup();
    const onExampleClick = vi.fn();
    render(<EmptyState onExampleClick={onExampleClick} />);
    await user.click(screen.getByText("Show me the top programming languages."));
    expect(onExampleClick).toHaveBeenCalledWith("Show me the top programming languages.");
  });
});
