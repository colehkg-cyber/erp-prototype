"use client";

import { Bell, Building2, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSidebar } from "./sidebar-context";

export function Header() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-30 border-b border-[#E8E8EC] bg-white dark:border-white/[0.06] dark:bg-[#0A0E1A]/80 dark:backdrop-blur-xl">
      {/* Company Info Bar */}
      <div className="flex items-center justify-between border-b border-[#E8E8EC] bg-[#F8F9FA] px-3 py-1.5 sm:px-6 dark:border-white/[0.04] dark:bg-[#0D1117]">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">뉴젠솔루션</span>
          <span className="hidden text-gray-300 sm:inline dark:text-gray-600">|</span>
          <span className="hidden sm:inline">7기</span>
          <span className="hidden text-gray-300 md:inline dark:text-gray-600">|</span>
          <span className="hidden md:inline">2025-01-01 ~ 2025-12-31</span>
          <span className="hidden text-gray-300 lg:inline dark:text-gray-600">|</span>
          <span className="hidden lg:inline">123-45-67890</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex h-14 items-center justify-between px-3 sm:px-6">
        {/* Left: Hamburger on mobile */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-white/[0.06]"
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:block" />

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          <button className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#555555] transition-colors hover:bg-[#F5F5F8] hover:text-[#222222] dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#2196F3] dark:bg-[#005AE0]" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
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
      </div>
    </header>
  );
}
