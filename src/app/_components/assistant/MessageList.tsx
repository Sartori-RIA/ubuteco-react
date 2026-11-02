"use client";

import ReactMarkdown from "react-markdown";
import {AiMessage} from "@/app/_types/assistant";

type Props = {
  messages: AiMessage[];
};

export function MessageList({messages}: Props) {
  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.role === "user"
              ? "ml-8 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
              : "mr-8 rounded-lg bg-surface-muted px-3 py-2 text-sm text-foreground"
          }
        >
          {message.role === "assistant" ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.text}</p>
          )}
        </div>
      ))}
    </div>
  );
}
