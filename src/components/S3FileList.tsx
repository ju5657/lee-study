"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface S3File {
  key: string;
  size: number;
  lastModified: string;
}

function S3FileList() {
  const { lang } = useLanguage();
  const [s3Files, setS3Files] = useState<S3File[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadS3Files();
  }, []);

  const loadS3Files = async () => {
    setLoadingFiles(true);
    try {
      const response = await fetch("/api/list");
      const data = await response.json();

      if (response.ok) {
        setS3Files(data.files || []);
      }
    } catch (error) {
      console.error(lang === 'ko' ? "파일 목록 로드 실패:" : "ファイル一覧のロード失敗:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(lang === 'ko' ? "정말 삭제하시겠습니까?" : "本当に削除しますか？")) return;

    setDeleting(key);
    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        await loadS3Files();
      } else {
        alert(lang === 'ko' ? "삭제 실패" : "削除失敗");
      }
    } catch (error) {
      console.error(lang === 'ko' ? "삭제 오류:" : "削除エラー:", error);
      alert(lang === 'ko' ? "오류 발생" : "エラー発生");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {lang === 'ko' ? 'S3 저장 파일 목록' : 'S3保存ファイル一覧'}
        </h2>
        <button
          onClick={loadS3Files}
          disabled={loadingFiles}
          className="text-sm px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
        >
          {loadingFiles ? (lang === 'ko' ? "로딩..." : "読み込み中...") : (lang === 'ko' ? "새로고침" : "再読み込み")}
        </button>
      </div>

      {loadingFiles ? (
        <p className="text-center text-slate-500">{lang === 'ko' ? '로딩 중...' : '読み込み中...'}</p>
      ) : s3Files.length === 0 ? (
        <p className="text-center text-slate-500">{lang === 'ko' ? '저장된 파일이 없습니다.' : '保存されたファイルがありません。'}</p>
      ) : (
        <div className="space-y-2">
          {s3Files.map((file) => (
            <div
              key={file.key}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 break-all">
                  {file.key}
                </p>
                <p className="text-xs text-slate-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => handleDelete(file.key)}
                disabled={deleting === file.key}
                className="ml-3 px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
              >
                {deleting === file.key ? (lang === 'ko' ? "삭제중..." : "削除中...") : (lang === 'ko' ? "삭제" : "削除")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default S3FileList;
