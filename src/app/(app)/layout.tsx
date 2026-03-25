"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AIChatPanel } from "@/components/ai-chat/chat-panel";

const STORAGE_KEY = "erp-sidebar-collapsed";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
    setMounted(true);

    const handler = (e: Event) => {
      setCollapsed((e as CustomEvent).detail);
    };
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F8] dark:bg-[#0A0E1A]">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ paddingLeft: mounted ? (collapsed ? 56 : 240) : 240 }}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
      <AIChatPanel />
    </div>
  );
}
