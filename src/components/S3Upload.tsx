"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface S3UploadProps {
  onUploadSuccess: () => void;
}

function S3Upload({ onUploadSuccess }: S3UploadProps) {
  const { lang } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadMessage({ type: "", text: "" });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage({
          type: "success",
          text:
            lang === 'ko'
              ? `✅ ${data.originalName} 업로드 완료!`
              : `✅ ${data.originalName} アップロード完了!`,
        });
        setSelectedFile(null);
        onUploadSuccess();
      } else {
        setUploadMessage({
          type: "error",
          text:
            lang === 'ko'
              ? `❌ 업로드 실패: ${data.error}`
              : `❌ アップロード失敗: ${data.error}`,
        });
      }
    } catch (error) {
      setUploadMessage({
        type: "error",
        text:
          lang === 'ko'
            ? `❌ 오류 발생: ${String(error)}`
            : `❌ エラー発生: ${String(error)}`,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex flex-col items-center gap-2">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100">
          {lang === 'ko' ? '파일 첨부' : 'ファイル添付'}
          <input
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        <p className="text-xs text-slate-500">{lang === 'ko' ? 'S3에 업로드' : 'S3にアップロード'}</p>
      </div>

      {selectedFile ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          <p className="font-medium text-slate-900">{lang === 'ko' ? '첨부된 파일' : '添付ファイル'}</p>
          <p>{lang === 'ko' ? '이름' : '名前'}: {selectedFile.name}</p>
          <p>{lang === 'ko' ? '용량' : '容量'}: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-3 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? (lang === 'ko' ? '업로드 중...' : 'アップロード中...') : (lang === 'ko' ? 'S3에 업로드' : 'S3にアップロード')}
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">{lang === 'ko' ? '첨부된 파일이 없습니다.' : '添付ファイルがありません。'}</p>
      )}

      {uploadMessage.text && (
        <p
          className={`text-sm ${
            uploadMessage.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {uploadMessage.text}
        </p>
      )}
    </div>
  );
}

export default S3Upload;
