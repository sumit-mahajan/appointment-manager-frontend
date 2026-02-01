import { useChat as useAIChat } from 'ai/react'
import { useChatStore } from '../store/chat.store'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api.constants'
import { toast } from 'sonner'

/**
 * Custom hook for AI chat functionality
 * Wraps Vercel AI SDK's useChat with our store and auth
 */
export function useChat() {
  const { isOpen, toggleChat, openChat, closeChat, clearMessages: clearStoreMessages } = useChatStore()
  const { token } = useAuthStore()

  // Get user's timezone and current date/time from browser
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date()
  const currentDateLocal = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const currentTimeLocal = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    reload,
    append,
    setMessages,
  } = useAIChat({
    api: `${API_BASE_URL}${API_ENDPOINTS.AI_CHAT}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'X-User-Timezone': userTimezone,
      'X-User-Date': currentDateLocal,
      'X-User-Time': currentTimeLocal,
    },
    onError: (error) => {
      console.error('Chat error:', error)
      toast.error(`AI Error: ${error.message || 'Failed to get response'}`)
    },
    onResponse: (response) => {
      console.log('Chat response status:', response.status)
      if (!response.ok) {
        console.error('Chat response error:', response.statusText)
      }
    },
    onFinish: (message) => {
      console.log('Chat finished:', message)
    },
  })

  const clearMessages = () => {
    setMessages([])
    clearStoreMessages()
  }

  return {
    // State
    messages,
    input,
    isOpen,
    isLoading,
    error,

    // Actions
    handleInputChange,
    handleSubmit,
    toggleChat,
    openChat,
    closeChat,
    clearMessages,
    stop,
    reload,
    append,
  }
}
