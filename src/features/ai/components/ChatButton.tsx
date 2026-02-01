import { MessageCircle, X } from 'lucide-react'

interface ChatButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X className="h-6 w-6 mx-auto" />
      ) : (
        <MessageCircle className="h-6 w-6 mx-auto" />
      )}
    </button>
  )
}
