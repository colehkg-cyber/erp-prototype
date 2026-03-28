"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  CircleDollarSign,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const menuItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/auto-journal", label: "AI 자동분개", icon: Sparkles },
  { href: "/cards", label: "카드관리", icon: CreditCard },
  { href: "/transactions", label: "거래내역", icon: Receipt },
  { href: "/billing", label: "과금현황", icon: CircleDollarSign },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const isCompact = onNavigate ? false : collapsed;

  return (
    <>
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center gap-2.5",
          isCompact ? "justify-center px-0" : "px-6"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#005AE0]">
          <span className="text-sm font-bold text-white">N</span>
        </div>
        {!isCompact && (
          <span className="whitespace-nowrap text-lg font-bold text-white">
            뉴젠 <span className="text-[#00D4FF]">AI ERP</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("mt-4 flex-1 space-y-1", isCompact ? "px-1.5" : "px-3")}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-[44px] items-center rounded-lg text-sm font-medium transition-all",
                  isCompact ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-white/10 text-[#00D4FF] dark:bg-[#005AE0]/15 dark:text-[#00D4FF]"
                    : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!isCompact && item.label}
              </Link>
              {/* Tooltip on collapsed (desktop only) */}
              {isCompact && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-800">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-1.5">
        <div className="group relative">
          <Link
            href="/login"
            onClick={onNavigate}
            className={cn(
              "flex min-h-[44px] items-center rounded-lg text-sm font-medium text-gray-500 transition-all hover:bg-white/[0.04] hover:text-gray-300",
              isCompact ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!isCompact && "로그아웃"}
          </Link>
          {isCompact && (
            <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-800">
              로그아웃
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DesktopSidebar() {
  const { collapsed, mounted, toggleCollapsed } = useSidebar();

  if (!mounted) {
    return (
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 bg-[#1A1A2E] md:block dark:bg-[#070B14]" />
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/[0.06] bg-[#1A1A2E] transition-all duration-300 md:flex dark:bg-[#070B14]",
        collapsed ? "w-[56px]" : "w-60"
      )}
    >
      <SidebarNav />
      {/* Toggle button (desktop only) */}
      <div className="border-t border-white/[0.06] p-1.5">
        <button
          onClick={toggleCollapsed}
          className="flex min-h-[44px] w-full items-center justify-center rounded-lg py-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}

function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-64 bg-[#1A1A2E] p-0 dark:bg-[#070B14]" showCloseButton={false}>
        <SheetTitle className="sr-only">메뉴</SheetTitle>
        <SheetDescription className="sr-only">내비게이션 메뉴</SheetDescription>
        <div className="flex h-full flex-col">
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
