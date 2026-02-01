import { format } from "date-fns";
import { User, Bot } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Message } from "ai/react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  if (!isUser && !isAssistant) {
    return null; // Don't render system messages
  }

  return (
    <div
      className={cn(
        "flex gap-4 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
      </div>

      {/* Message Content */}
      <div
        className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
      >
        <div
          className={cn(
            "max-w-[420px] rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-secondary/60 text-secondary-foreground rounded-tl-sm backdrop-blur-sm"
          )}
        >
          {/* Render content with basic markdown support */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Timestamp */}
        {message.createdAt && (
          <span className="text-xs text-muted-foreground mt-1.5 px-1">
            {format(new Date(message.createdAt), "h:mm a")}
          </span>
        )}
      </div>
    </div>
  );
}
