import { useEffect } from "react";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";
import { useChat } from "../hooks/useChat";

export function ChatContainer() {
  const {
    messages,
    input,
    isOpen,
    isLoading,
    isListening,
    isSpeechSupported,
    handleInputChange,
    handleSubmit,
    toggleChat,
    closeChat,
    startVoice,
    stopVoice,
  } = useChat();

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeChat();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeChat]);

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={toggleChat} />
      {isOpen && (
        <ChatWindow
          messages={messages}
          input={input}
          isLoading={isLoading}
          isListening={isListening}
          isSpeechSupported={isSpeechSupported}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={closeChat}
          onStartVoice={startVoice}
          onStopVoice={stopVoice}
        />
      )}
    </>
  );
}
