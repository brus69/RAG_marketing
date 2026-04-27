"use client";

import { Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isStreaming?: boolean;
}

export default function ChatWindow({
  messages,
  onSendMessage,
  isStreaming,
}: ChatWindowProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="mt-20 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Чем могу помочь?
              </h1>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Спросите о маркетинге, стратегии, анализе рынка. База знаний содержит гайды по TAM/SAM/SOM, BOS Canvas, Six Paths, ERRC Grid, конкурентному анализу и другим темам.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
          )}
          {isStreaming && (
            <div className="flex gap-4 mt-4">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="text-sm text-gray-400">Думаю...</div>
            </div>
          )}
        </div>
      </div>
      <ChatInput onSend={onSendMessage} disabled={isStreaming} />
    </div>
  );
}