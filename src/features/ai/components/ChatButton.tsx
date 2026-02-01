import { MessageCircle, X } from "lucide-react";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-2xl transition-all hover:scale-110 hover:shadow-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="h-7 w-7 mx-auto transition-transform duration-200" />
      ) : (
        <MessageCircle className="h-7 w-7 mx-auto transition-transform duration-200" />
      )}
    </button>
  );
}
