"use client";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCognito } from "@/contexts/CognitoContext";

const S3Header: React.FC = () => {
  const { lang } = useLanguage();
  const { signOut } = useCognito();
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-slate-900">
        {lang === "ko" ? "S3 파일 관리" : "S3ファイル管理"}
      </h1>
      <button
        onClick={signOut}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
      >
        {lang === "ko" ? "로그아웃" : "ログアウト"}
      </button>
    </div>
  );
};

export default S3Header;
