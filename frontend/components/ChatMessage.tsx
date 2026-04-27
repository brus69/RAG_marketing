"use client";

import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

function formatContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={idx} className="font-semibold">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li key={idx} className="ml-5 list-disc">
          {line.slice(2)}
        </li>
      );
    }
    if (line.startsWith("| ")) {
      return (
        <code key={idx} className="text-xs bg-gray-100 px-1 rounded">
          {line}
        </code>
      );
    }
    if (line.startsWith("```")) return null;
    if (/^\d+\.\s/.test(line)) {
      return <p key={idx} className="ml-5">{line}</p>;
    }
    if (line.startsWith("#")) {
      return (
        <h3 key={idx} className="font-semibold mt-3 mb-1">
          {line.replace(/^#+\s*/, "")}
        </h3>
      );
    }
    if (line.trim() === "") return <br key={idx} />;
    return (
      <span key={idx}>
        {line.includes("`") ? (
          <code className="bg-gray-100 px-1 rounded text-sm">{line.replace(/`/g, "")}</code>
        ) : line}
      </span>
    );
  });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "bg-white py-2 px-4" : "bg-white py-2 px-4"}>
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4">
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          )}
          <div className={`flex-1 ${isUser ? "ml-auto max-w-[80%]" : ""}`}>
            <div className="text-sm text-gray-900">
              <div className="whitespace-pre-wrap">{formatContent(message.content)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}