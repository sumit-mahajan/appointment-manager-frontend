import { format } from 'date-fns'
import { User, Bot } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Message } from 'ai/react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  if (!isUser && !isAssistant) {
    return null // Don't render system messages
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'max-w-[280px] rounded-lg px-4 py-2 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          {/* Render content with basic markdown support */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Timestamp */}
        {message.createdAt && (
          <span className="text-xs text-muted-foreground mt-1">
            {format(new Date(message.createdAt), 'h:mm a')}
          </span>
        )}
      </div>
    </div>
  )
}
