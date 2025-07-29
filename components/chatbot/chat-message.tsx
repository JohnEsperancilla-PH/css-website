"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isTyping?: boolean;
}

export function ChatMessage({ content, role, isTyping = false }: ChatMessageProps) {
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
          <AvatarFallback className="bg-primary">
            <User className="h-4 w-4 text-primary-foreground" />
          </AvatarFallback>
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
        {isTyping ? (
          <div className="flex gap-1 h-4 items-center">
            <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-typing1" />
            <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-typing2" />
            <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-typing3" />
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
} 