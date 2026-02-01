import { create } from 'zustand'
import type { Message } from '../types/chat.types'

interface ChatState {
  messages: Message[]
  isOpen: boolean
  isLoading: boolean

  // Actions
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  setLoading: (isLoading: boolean) => void
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages: Message[]) =>
    set({ messages }),

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),

  toggleChat: () =>
    set((state) => ({ isOpen: !state.isOpen })),

  openChat: () =>
    set({ isOpen: true }),

  closeChat: () =>
    set({ isOpen: false }),

  clearMessages: () =>
    set({ messages: [] }),
}))
