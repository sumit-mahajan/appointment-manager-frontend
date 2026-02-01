import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ChatContainer } from "../ChatContainer";
import { useChat } from "../../hooks/useChat";

// Mock the useChat hook
vi.mock("../../hooks/useChat");

describe("ChatContainer", () => {
  const mockToggleChat = vi.fn();
  const mockCloseChat = vi.fn();
  const mockClearMessages = vi.fn();
  const mockHandleInputChange = vi.fn();
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useChat as any).mockReturnValue({
      messages: [],
      input: "",
      isOpen: false,
      isLoading: false,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      toggleChat: mockToggleChat,
      closeChat: mockCloseChat,
      clearMessages: mockClearMessages,
    });
  });

  it("renders chat button", () => {
    render(<ChatContainer />);
    const button = screen.getByLabelText(/open chat/i);
    expect(button).toBeInTheDocument();
  });

  it("toggles chat when button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatContainer />);

    const button = screen.getByLabelText(/open chat/i);
    await user.click(button);

    expect(mockToggleChat).toHaveBeenCalledOnce();
  });

  it("renders chat window when open", () => {
    (useChat as any).mockReturnValue({
      messages: [],
      input: "",
      isOpen: true,
      isLoading: false,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      toggleChat: mockToggleChat,
      closeChat: mockCloseChat,
      clearMessages: mockClearMessages,
    });

    render(<ChatContainer />);

    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
  });

  it("does not render chat window when closed", () => {
    render(<ChatContainer />);

    expect(screen.queryByText(/AI Assistant/i)).not.toBeInTheDocument();
  });

  it("closes chat on escape key", async () => {
    (useChat as any).mockReturnValue({
      messages: [],
      input: "",
      isOpen: true,
      isLoading: false,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      toggleChat: mockToggleChat,
      closeChat: mockCloseChat,
      clearMessages: mockClearMessages,
    });

    render(<ChatContainer />);

    await userEvent.keyboard("{Escape}");

    expect(mockCloseChat).toHaveBeenCalledOnce();
  });
});
