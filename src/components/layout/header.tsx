"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E8E8EC] bg-white px-6 dark:border-white/[0.06] dark:bg-[#0A0E1A]/80 dark:backdrop-blur-xl">
      <div />
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-[#555555] transition-colors hover:bg-[#F5F5F8] hover:text-[#222222] dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#2196F3] dark:bg-[#005AE0]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-[#222222] dark:text-gray-200">관리자</p>
            <p className="text-xs text-[#555555] dark:text-gray-500">뉴젠솔루션</p>
          </div>
          <Avatar className="h-8 w-8 border border-[#E8E8EC] dark:border-white/10">
            <AvatarFallback className="bg-[#2196F3] text-xs text-white dark:bg-[#005AE0]">
              관
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
