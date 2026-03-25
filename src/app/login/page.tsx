"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0A0E1A]">
      <div className="w-full max-w-sm px-4">
        {/* Card wrapper for light mode */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-[#1E2942] dark:bg-[#121A2E] dark:shadow-none">
          <div className="space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 dark:bg-[#005AE0]">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                뉴젠 <span className="text-blue-600 dark:text-[#00D4FF]">AI ERP</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                카드 결제 자동 수집 & 과금 서비스
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-gray-600 dark:text-gray-400">이메일</label>
                <Input
                  type="email"
                  placeholder="admin@neuzen.co.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white dark:border-[#1E2942] dark:bg-[#0A0E1A] dark:text-gray-200 dark:placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-gray-600 dark:text-gray-400">비밀번호</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white dark:border-[#1E2942] dark:bg-[#0A0E1A] dark:text-gray-200 dark:placeholder:text-gray-600"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-[#005AE0] dark:hover:bg-[#0047B3]"
              >
                로그인
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          © 2026 뉴젠솔루션. All rights reserved.
        </p>
      </div>
    </div>
  );
}
