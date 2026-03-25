"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AIChatPanel } from "@/components/ai-chat/chat-panel";
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";

function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed, mounted } = useSidebar();
  const sidebarWidth = mounted ? (collapsed ? 56 : 240) : 240;

  return (
    <div className="min-h-screen bg-[#F5F5F8] dark:bg-[#0A0E1A]">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ ["--sidebar-w" as string]: `${sidebarWidth}px` }}
      >
        <div className="transition-all duration-300 md:pl-[var(--sidebar-w)]">
          <Header />
          <main className="p-3 sm:p-6">{children}</main>
        </div>
      </div>
      <AIChatPanel />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
