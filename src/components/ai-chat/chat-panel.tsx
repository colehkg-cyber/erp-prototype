"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles, Bot, User } from "lucide-react";
import { chatQAData, defaultResponse } from "./chat-data";
import { ChatButton } from "./chat-button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

export function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addResponse = useCallback((question: string) => {
    setIsProcessing(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);

    const match = chatQAData.find((qa) => qa.question === question);
    const answer = match ? match.answer : defaultResponse;

    const typingId = (Date.now() + 1).toString();
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: typingId, role: "assistant", content: "", isTyping: true },
      ]);
    }, 300);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId ? { ...m, content: answer, isTyping: false } : m
        )
      );
      setIsProcessing(false);
    }, 800);
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || isProcessing) return;
    const q = input.trim();
    setInput("");
    addResponse(q);
  }, [input, isProcessing, addResponse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const showSuggestions = messages.length === 0;

  if (!isOpen) {
    return <ChatButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel — fullscreen on mobile, floating on desktop */}
      <div className="fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[560px] sm:w-[400px] sm:max-w-[calc(100vw-48px)] sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl dark:bg-[#121A2E] sm:dark:border-white/10">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">뉴젠 AI 어시스턴트</h3>
              <p className="text-xs text-white/70">무엇이든 물어보세요</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {showSuggestions ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20">
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">안녕하세요! 👋</p>
              <p className="mb-5 text-center text-xs text-gray-500 dark:text-gray-400">
                ERP 데이터에 대해 궁금한 점을 물어보세요
              </p>
              {/* Suggestion chips — horizontal scroll on mobile */}
              <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0">
                <div className="flex flex-nowrap justify-center gap-2 sm:flex-wrap">
                  {chatQAData.map((qa) => (
                    <button
                      key={qa.question}
                      onClick={() => addResponse(qa.question)}
                      className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 sm:py-1.5 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[280px] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-white/[0.08] dark:text-gray-200"
                    }`}
                  >
                    {msg.isTyping ? (
                      <div className="flex items-center gap-1 py-1">
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10">
                      <User className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestion chips when in conversation */}
        {messages.length > 0 && !isProcessing && (
          <div className="border-t border-gray-100 px-4 py-2 dark:border-white/5">
            <div className="flex gap-1.5 overflow-x-auto">
              {chatQAData.slice(0, 3).map((qa) => (
                <button
                  key={qa.question}
                  onClick={() => addResponse(qa.question)}
                  className="shrink-0 rounded-full border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:text-gray-400 dark:hover:border-blue-500/30 dark:hover:text-blue-400"
                >
                  {qa.question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 px-4 py-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="질문을 입력하세요..."
              disabled={isProcessing}
              className="min-h-[44px] flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-blue-400 focus:bg-white disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:bg-white/[0.08]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
