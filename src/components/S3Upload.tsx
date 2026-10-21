"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/** 업로드 허용 최대 크기 (1MB 미만). 서버(/api/upload)에서도 같은 값으로 검사한다. */
const MAX_UPLOAD_BYTES = 1024 * 1024;

interface S3UploadProps {
  onUploadSuccess: () => void;
}

const TEXT = {
  ko: {
    attach: "파일 첨부",
    hint: "S3에 업로드 (1MB 미만)",
    attached: "첨부된 파일",
    name: "이름",
    size: "용량",
    upload: "S3에 업로드",
    uploading: "업로드 중...",
    none: "첨부된 파일이 없습니다.",
    limitTitle: "용량 제한",
    limitBody: (size: string) =>
      `이 파일은 ${size}입니다. 1MB 미만의 파일만 업로드할 수 있습니다.`,
    close: "확인",
    done: (n: string) => `✅ ${n} 업로드 완료!`,
    fail: (e: string) => `❌ 업로드 실패: ${e}`,
    error: (e: string) => `❌ 오류 발생: ${e}`,
  },
  ja: {
    attach: "ファイル添付",
    hint: "S3にアップロード (1MB未満)",
    attached: "添付ファイル",
    name: "名前",
    size: "容量",
    upload: "S3にアップロード",
    uploading: "アップロード中...",
    none: "添付ファイルがありません。",
    limitTitle: "容量制限",
    limitBody: (size: string) =>
      `このファイルは ${size} です。1MB未満のファイルのみアップロードできます。`,
    close: "OK",
    done: (n: string) => `✅ ${n} アップロード完了!`,
    fail: (e: string) => `❌ アップロード失敗: ${e}`,
    error: (e: string) => `❌ エラー発生: ${e}`,
  },
};

const formatSize = (bytes: number) =>
  bytes >= MAX_UPLOAD_BYTES
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(2)} KB`;

function S3Upload({ onUploadSuccess }: S3UploadProps) {
  const { lang } = useLanguage();
  const t = TEXT[lang];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [oversizedFile, setOversizedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setUploadMessage({ type: "", text: "" });

    // 1MB 이상이면 선택을 취소하고 팝업 표시
    if (file && file.size >= MAX_UPLOAD_BYTES) {
      setSelectedFile(null);
      setOversizedFile(file);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
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
        setUploadMessage({ type: "success", text: t.done(data.originalName) });
        setSelectedFile(null);
        onUploadSuccess();
      } else if (response.status === 413) {
        setSelectedFile(null);
        setOversizedFile(selectedFile);
      } else {
        setUploadMessage({ type: "error", text: t.fail(data.error) });
      }
    } catch (error) {
      setUploadMessage({ type: "error", text: t.error(String(error)) });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex flex-col items-center gap-2">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100">
          {t.attach}
          <input
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        <p className="text-xs text-slate-500">{t.hint}</p>
      </div>

      {selectedFile ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          <p className="font-medium text-slate-900">{t.attached}</p>
          <p>{t.name}: {selectedFile.name}</p>
          <p>{t.size}: {formatSize(selectedFile.size)}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-3 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? t.uploading : t.upload}
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">{t.none}</p>
      )}

      {uploadMessage.text && (
        <p
          className={`text-sm ${
            uploadMessage.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {uploadMessage.text}
        </p>
      )}

      {oversizedFile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setOversizedFile(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{t.limitTitle}</h2>
            <p className="text-sm text-slate-700 break-all mb-1">{oversizedFile.name}</p>
            <p className="text-sm text-slate-700 mb-5">{t.limitBody(formatSize(oversizedFile.size))}</p>
            <button
              onClick={() => setOversizedFile(null)}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default S3Upload;
