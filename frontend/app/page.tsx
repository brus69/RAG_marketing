"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import ChatWindow from "@/components/ChatWindow";
import { Message, Source } from "@/lib/types";
import { mockResponses } from "@/lib/mock-responses";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const findMockResponse = (query: string): { response: string; sources: Source[] } => {
    for (const mock of mockResponses) {
      if (mock.pattern.test(query)) {
        return { response: mock.response, sources: mock.sources };
      }
    }
    const fallback = mockResponses[mockResponses.length - 1];
    return { response: fallback.response, sources: fallback.sources };
  };

  const simulateStreaming = useCallback(
    async (query: string) => {
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: query,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsStreaming(true);
      const { response, sources } = findMockResponse(query);

      let currentContent = "";
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
        sources: [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const chars = response.split("");
      for (let i = 0; i < chars.length; i++) {
        currentContent += chars[i];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: currentContent, sources }
              : msg
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 15));
      }

      setIsStreaming(false);
    },
    []
  );

  const handleSendMessage = (message: string) => {
    simulateStreaming(message);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
      />
    </div>
  );
}