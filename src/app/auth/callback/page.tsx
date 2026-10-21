"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AuthCallback() {
  const router = useRouter();
  const { lang } = useLanguage();

  useEffect(() => {
    // Cognito OAuth 리다이렉트 후 처리
    const timer = setTimeout(() => {
      router.push("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {lang === "ko" ? "로그인 중..." : "ログイン中..."}
        </h1>
        <p className="text-slate-600">
          {lang === "ko" ? "잠시만 기다려주세요." : "しばらくお待ちください。"}
        </p>
      </div>
    </main>
  );
}
