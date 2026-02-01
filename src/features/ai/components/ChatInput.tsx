import { Send, Loader2 } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ChatInput({
  input,
  isLoading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input when loading completes
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as any);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (e.g., 'Book appointment for John tomorrow 2pm')"
          className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 max-h-32 min-h-[40px]"
          rows={1}
          disabled={isLoading}
          autoFocus
          style={{
            height: "auto",
            minHeight: "40px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.min(target.scrollHeight, 128) + "px";
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
}
