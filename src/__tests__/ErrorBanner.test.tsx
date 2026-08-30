import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBanner } from "@/components/chat/ErrorBanner";

describe("ErrorBanner", () => {
  it("renders nothing when no error", () => {
    const { container } = render(
      <ErrorBanner error={undefined} isRetrying={false} hasPartialContent={false} onRetry={vi.fn()} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("shows generic error message for unknown errors", () => {
    render(
      <ErrorBanner
        error={new Error("something broke")}
        isRetrying={false}
        hasPartialContent={false}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText(/An error occurred while generating/)).toBeInTheDocument();
  });

  it("shows rate limit message for 429 errors", () => {
    render(
      <ErrorBanner
        error={new Error("429 rate limit exceeded")}
        isRetrying={false}
        hasPartialContent={false}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText("Service is busy")).toBeInTheDocument();
    expect(screen.getByText(/rate-limited/)).toBeInTheDocument();
  });

  it("shows connection lost message for network errors", () => {
    render(
      <ErrorBanner
        error={new Error("Failed to fetch")}
        isRetrying={false}
        hasPartialContent={false}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText("Connection lost")).toBeInTheDocument();
  });

  it("shows partial content warning when interrupted mid-stream", () => {
    render(
      <ErrorBanner
        error={new Error("stream interrupted")}
        isRetrying={false}
        hasPartialContent={true}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText(/interrupted/)).toBeInTheDocument();
    expect(screen.getByText(/preserved/)).toBeInTheDocument();
  });

  it("shows retry button that calls onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <ErrorBanner
        error={new Error("test error")}
        isRetrying={false}
        hasPartialContent={false}
        onRetry={onRetry}
      />
    );
    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("disables retry button while retrying", () => {
    render(
      <ErrorBanner
        error={new Error("test error")}
        isRetrying={true}
        hasPartialContent={false}
        onRetry={vi.fn()}
      />
    );
    const retryButton = screen.getByRole("button", { name: /retrying/i });
    expect(retryButton).toBeDisabled();
  });
});
