"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  CircleDollarSign,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/cards", label: "카드관리", icon: CreditCard },
  { href: "/transactions", label: "거래내역", icon: Receipt },
  { href: "/billing", label: "과금현황", icon: CircleDollarSign },
];

const STORAGE_KEY = "erp-sidebar-collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    // Dispatch event so layout can react
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  };

  // Prevent flash of wrong width
  if (!mounted) {
    return (
      <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-[#1A1A2E] dark:bg-[#070B14]" />
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] bg-[#1A1A2E] transition-all duration-300 dark:bg-[#070B14]",
        collapsed ? "w-[56px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center gap-2.5", collapsed ? "justify-center px-0" : "px-6")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#005AE0]">
          <span className="text-sm font-bold text-white">N</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-white whitespace-nowrap">
            뉴젠 <span className="text-[#00D4FF]">AI ERP</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("mt-4 flex-1 space-y-1", collapsed ? "px-1.5" : "px-3")}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all",
                  collapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-white/10 text-[#00D4FF] dark:bg-[#005AE0]/15 dark:text-[#00D4FF]"
                    : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && item.label}
              </Link>
              {/* Tooltip on collapsed */}
              {collapsed && (
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
        {/* Logout */}
        <div className="relative group">
          <Link
            href="/login"
            className={cn(
              "flex items-center rounded-lg text-sm font-medium text-gray-500 transition-all hover:bg-white/[0.04] hover:text-gray-300",
              collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && "로그아웃"}
          </Link>
          {collapsed && (
            <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-800">
              로그아웃
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800" />
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleCollapsed}
          className="mt-1 flex w-full items-center justify-center rounded-lg py-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
