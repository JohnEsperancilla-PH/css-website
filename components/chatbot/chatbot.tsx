"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChatMessage } from "./chat-message";
import { MessageSquare, X, ExternalLink, Trash2, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const WELCOME_MESSAGE = {
  role: "assistant" as const,
  content: "Hi there! 👋 I'm your CSS CoPilot, here to help you learn more about the Computer Science Society - USLS. What would you like to know?"
};

// Common questions that will be randomly selected
const SUGGESTED_QUESTIONS = [
  "What events do you organize?",
  "How can I join CSS?",
  "When are the regular meetings?",
  "What programming workshops do you offer?",
  "What are the membership benefits?",
  "How can I participate in projects?",
  "What is the membership fee?",
  "Do you offer coding tutorials?",
  "Can freshmen join CSS?",
  "What programming languages do you focus on?"
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  // Get context and system prompt from environment variables
  const context = process.env.NEXT_PUBLIC_CHATBOT_CONTEXT || "";
  const systemPrompt = process.env.NEXT_PUBLIC_CHATBOT_SYSTEM_PROMPT || "";

  // Initialize random suggested questions
  useEffect(() => {
    updateSuggestedQuestions();
  }, []);

  const updateSuggestedQuestions = () => {
    const shuffled = [...SUGGESTED_QUESTIONS].sort(() => 0.5 - Math.random());
    setSuggestedQuestions(shuffled.slice(0, 3));
  };

  const handleClearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    updateSuggestedQuestions();
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    handleSubmit(null, question);
  };

  useEffect(() => {
    if (!context) {
      setError("Chatbot context not configured");
    }
    if (!systemPrompt) {
      setError("Chatbot system prompt not configured");
    }
  }, [context, systemPrompt]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent | null, suggestedInput?: string) => {
    if (e) e.preventDefault();
    const messageText = suggestedInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "CSS CoPilot",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API}`,
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: `${systemPrompt}\n\nKnowledge base: ${context}`,
            },
            ...messages,
            userMessage,
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant" as const,
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      updateSuggestedQuestions();
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! 😅 I ran into a small hiccup. Could you try asking that again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-lg shadow-lg w-[350px] h-[500px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">CSS CoPilot</h3>
              <a
                href="https://cscopilot.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                Learn More
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            {isLoading && (
              <ChatMessage
                role="assistant"
                content=""
                isTyping={true}
              />
            )}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Suggested questions:</p>
                <div className="flex flex-col gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-sm text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything! 😊"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading} className="shrink-0">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          className={cn(
            "h-12 w-12 rounded-full",
            "animate-bounce hover:animate-none"
          )}
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
} 