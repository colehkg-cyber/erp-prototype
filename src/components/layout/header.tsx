"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0A0E1A]/80 px-6 backdrop-blur-xl">
      <div />
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#005AE0]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-200">관리자</p>
            <p className="text-xs text-gray-500">뉴젠솔루션</p>
          </div>
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarFallback className="bg-[#005AE0] text-xs text-white">
              관
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
