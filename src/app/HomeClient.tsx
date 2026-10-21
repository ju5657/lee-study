"use client";
import HeaderLangSelector from "@/components/HeaderLangSelector";
import S3Header from "@/components/S3Header";
import S3Upload from "@/components/S3Upload";
import S3FileList from "@/components/S3FileList";
import NameInput from "@/components/NameInput";
import DynamoDBTable from "@/components/DynamoDBTable";
import { useCognito } from "@/contexts/CognitoContext";
import CognitoLoginForm from "@/components/CognitoLoginForm";

import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState } from "react";

export default function HomeClient() {
  const { isLoggedIn, loading } = useCognito();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { lang } = useLanguage();
  const handleUploadSuccess = () => setRefreshTrigger((prev) => prev + 1);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="absolute top-0 left-0 w-full"><HeaderLangSelector /></div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">로딩 중...</h1>
          <p className="text-slate-600">잠시만 기다려주세요.</p>
        </div>
      </main>
    );
  }
  if (!isLoggedIn) {
    return (
      <>
        <HeaderLangSelector />
        <CognitoLoginForm />
      </>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <HeaderLangSelector />
      <div className="max-w-2xl mx-auto">
        <S3Header />
        <S3Upload onUploadSuccess={handleUploadSuccess} />
        <S3FileList key={refreshTrigger} />
        <NameInput />
        {/* DynamoDB 조회 컴포넌트 */}
        <div style={{ marginTop: "3rem" }}>
          <DynamoDBTable lang={lang} />
        </div>
      </div>
    </main>
  );
}