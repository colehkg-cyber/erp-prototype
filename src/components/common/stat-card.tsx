"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  lightColor?: string;
  change?: string;
}

export function StatCard({ title, value, icon: Icon, color, lightColor, change }: StatCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const accentColor = isDark ? color : (lightColor ?? color);

  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-[#1E2942] dark:bg-[#121A2E]">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              {value}
            </p>
            {change && (
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-xs text-gray-500 dark:text-gray-500">{change}</span>
              </div>
            )}
          </div>
          <div
            className="ml-3 shrink-0 rounded-lg p-2.5"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
