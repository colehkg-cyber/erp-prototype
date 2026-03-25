"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  CircleDollarSign,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/cards", label: "카드관리", icon: CreditCard },
  { href: "/transactions", label: "거래내역", icon: Receipt },
  { href: "/billing", label: "과금현황", icon: CircleDollarSign },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-white/[0.06] bg-[#070B14]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#005AE0]">
          <span className="text-sm font-bold text-white">N</span>
        </div>
        <span className="text-lg font-bold text-white">
          뉴젠 <span className="text-[#00D4FF]">AI ERP</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#005AE0]/15 text-[#00D4FF]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-white/[0.04] hover:text-gray-300"
        >
          <LogOut className="h-[18px] w-[18px]" />
          로그아웃
        </Link>
      </div>
    </aside>
  );
}
