/**
 * Types for AI chat feature
 */

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
}
