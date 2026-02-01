import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { Message } from "ai/react";

interface ChatWindowProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  isListening: boolean;
  isSpeechSupported: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
}

export function ChatWindow({
  messages,
  input,
  isLoading,
  isListening,
  isSpeechSupported,
  onInputChange,
  onSubmit,
  onClose,
  onStartVoice,
  onStopVoice,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Chat window - centered */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[650px] h-[600px] bg-background border border-border/50 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
            <h3 className="font-semibold text-xl">AI Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-all p-2 rounded-lg hover:bg-secondary/50"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <div className="space-y-4 max-w-md">
                <p className="text-lg font-medium">
                  Welcome! How can I help you today?
                </p>
                <p className="text-sm">
                  You can type or use voice input to interact
                </p>
                <div className="mt-6 space-y-2 text-xs text-left bg-secondary/30 rounded-lg p-4">
                  <p className="font-semibold mb-2">Try these commands:</p>
                  <p className="opacity-80">
                    "Book appointment for John tomorrow at 2pm"
                  </p>
                  <p className="opacity-80">"Show me today's appointments"</p>
                  <p className="opacity-80">"Create patient Jane Smith"</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <div className="flex gap-1">
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
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
          isListening={isListening}
          isSpeechSupported={isSpeechSupported}
          onChange={onInputChange}
          onSubmit={onSubmit}
          onStartVoice={onStartVoice}
          onStopVoice={onStopVoice}
        />
      </div>
    </>
  );
}
