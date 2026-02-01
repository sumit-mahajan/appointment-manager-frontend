import { useEffect, useRef } from 'react'
import { X, Trash2 } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import type { Message } from 'ai/react'

interface ChatWindowProps {
  messages: Message[]
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
  onClear: () => void
}

export function ChatWindow({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onClose,
  onClear,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="fixed bottom-24 right-6 z-40 w-[380px] h-[500px] bg-background border rounded-lg shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-semibold text-lg">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary"
              aria-label="Clear messages"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="mb-2">👋 Hi! How can I help you today?</p>
            <p className="text-sm">Try:</p>
            <ul className="text-xs mt-2 space-y-1">
              <li>"Book appointment for John tomorrow at 2pm"</li>
              <li>"Show me today's appointments"</li>
              <li>"Create patient Jane Smith"</li>
            </ul>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onChange={onInputChange}
        onSubmit={onSubmit}
      />
    </div>
  )
}
