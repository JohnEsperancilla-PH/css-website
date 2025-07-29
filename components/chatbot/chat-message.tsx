"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

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
      <Avatar className="h-8 w-8">
        {role === "assistant" ? (
          <AvatarImage src="/images/css-logo.png" alt="CSS Logo" />
        ) : (
          <AvatarFallback>U</AvatarFallback>
        )}
      </Avatar>
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