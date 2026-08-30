import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "@/components/chat/ChatInput";

describe("ChatInput", () => {
  it("renders textarea and send button", () => {
    render(
      <ChatInput
        input=""
        handleInputChange={vi.fn()}
        handleSubmit={vi.fn()}
        isLoading={false}
      />
    );
    expect(screen.getByPlaceholderText("Message Assistant...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("disables send button when input is empty", () => {
    render(
      <ChatInput
        input=""
        handleInputChange={vi.fn()}
        handleSubmit={vi.fn()}
        isLoading={false}
      />
    );
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("disables send button when input is whitespace only", () => {
    render(
      <ChatInput
        input="   "
        handleInputChange={vi.fn()}
        handleSubmit={vi.fn()}
        isLoading={false}
      />
    );
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("enables send button when input has content", () => {
    render(
      <ChatInput
        input="hello"
        handleInputChange={vi.fn()}
        handleSubmit={vi.fn()}
        isLoading={false}
      />
    );
    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
  });

  it("disables textarea when loading", () => {
    render(
      <ChatInput
        input="hello"
        handleInputChange={vi.fn()}
        handleSubmit={vi.fn()}
        isLoading={true}
      />
    );
    expect(screen.getByPlaceholderText("Message Assistant...")).toBeDisabled();
  });

  it("calls handleSubmit on form submit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <ChatInput
        input="hello"
        handleInputChange={vi.fn()}
        handleSubmit={handleSubmit}
        isLoading={false}
      />
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("calls handleInputChange when typing", async () => {
    const user = userEvent.setup();
    const handleInputChange = vi.fn();
    render(
      <ChatInput
        input=""
        handleInputChange={handleInputChange}
        handleSubmit={vi.fn()}
        isLoading={false}
      />
    );
    await user.type(screen.getByPlaceholderText("Message Assistant..."), "a");
    expect(handleInputChange).toHaveBeenCalled();
  });
});
