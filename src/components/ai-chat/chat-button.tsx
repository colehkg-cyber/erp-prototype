"use client";

import { Sparkles } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
      style={{
        background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
      }}
      aria-label="AI 어시스턴트 열기"
    >
      <Sparkles className="h-6 w-6 text-white" />
    </button>
  );
}
