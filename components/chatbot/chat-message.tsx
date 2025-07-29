"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "../ui/avatar";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export function ChatMessage({ content, role }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 p-2",
        role === "user" ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar
        className="h-8 w-8"
        src={role === "assistant" ? "/images/css-logo.png" : undefined}
      />
      <div
        className={cn(
          "rounded-lg px-3 py-2 max-w-[80%]",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {content}
      </div>
    </div>
  );
} 