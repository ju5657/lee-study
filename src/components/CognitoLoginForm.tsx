"use client";

import { getCognitoAuthUrl } from "@/config/cognito";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CognitoLoginForm() {
  const { lang } = useLanguage();
  const handleCognitoLogin = () => {
    const authUrl = getCognitoAuthUrl();
    window.location.href = authUrl;
  };

  const TEXT = {
    ko: {
      title: "로그인",
      button: "AWS Cognito로 로그인",
      desc: "AWS Cognito를 통해 안전하게 로그인하세요.",
    },
    ja: {
      title: "ログイン",
      button: "AWS Cognitoでログイン",
      desc: "AWS Cognitoを通じて安全にログインしてください。",
    },
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">
            {TEXT[lang].title}
          </h1>

          <button
            onClick={handleCognitoLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition mb-4"
          >
            {TEXT[lang].button}
          </button>

          <p className="text-center text-slate-600 text-sm">
            {TEXT[lang].desc}
          </p>
        </div>
      </div>
    </main>
  );
}
