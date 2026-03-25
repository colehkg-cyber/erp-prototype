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
    <div className="flex min-h-screen items-center justify-center bg-[#0A0E1A]">
      <div className="w-full max-w-sm space-y-8 px-4">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#005AE0]">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            뉴젠 <span className="text-[#00D4FF]">AI ERP</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            카드 결제 자동 수집 & 과금 서비스
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-gray-400">이메일</label>
            <Input
              type="email"
              placeholder="admin@neuzen.co.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/[0.08] bg-[#121A2E] text-gray-200 placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-400">비밀번호</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/[0.08] bg-[#121A2E] text-gray-200 placeholder:text-gray-600"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#005AE0] text-white hover:bg-[#0047B3]"
          >
            로그인
          </Button>
        </form>

        <p className="text-center text-xs text-gray-600">
          © 2026 뉴젠솔루션. All rights reserved.
        </p>
      </div>
    </div>
  );
}
