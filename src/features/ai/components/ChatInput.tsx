import { Send, Loader2, Mic, MicOff } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isListening: boolean;
  isSpeechSupported: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
}

export function ChatInput({
  input,
  isLoading,
  isListening,
  isSpeechSupported,
  onChange,
  onSubmit,
  onStartVoice,
  onStopVoice,
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

  const handleVoiceToggle = () => {
    if (isListening) {
      onStopVoice();
    } else {
      onStartVoice();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-t p-6 bg-background/50 backdrop-blur-sm"
    >
      <div className="flex gap-3 items-end">
        {/* Voice Input Button */}
        {isSpeechSupported && (
          <button
            type="button"
            onClick={handleVoiceToggle}
            disabled={isLoading}
            className={`flex-shrink-0 h-12 w-12 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg ${
              isListening
                ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 animate-pulse shadow-red-500/50"
                : "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary hover:scale-105"
            }`}
            aria-label={isListening ? "Stop recording" : "Start voice input"}
            title={isListening ? "Stop recording" : "Click to speak"}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isSpeechSupported
              ? "Type or click the mic to speak..."
              : "Type a message..."
          }
          className="flex-1 resize-none rounded-xl border-2 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all max-h-32 min-h-[48px]"
          rows={1}
          disabled={isLoading}
          autoFocus
          style={{
            height: "auto",
            minHeight: "48px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.min(target.scrollHeight, 128) + "px";
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Voice Indicator */}
      {isListening && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 animate-in fade-in duration-200">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-medium">Listening... Speak now</span>
        </div>
      )}

      {/* Unsupported Browser Message */}
      {!isSpeechSupported && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Voice input not supported in this browser. Please use Chrome or Edge.
        </div>
      )}
    </form>
  );
}
