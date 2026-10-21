import React, { useState } from "react";
import type { Lang } from "@/contexts/LanguageContext";

const LABELS = {
  ko: {
    title: "DynamoDB 조회",
    query: "조회",
    loading: "조회 중...",
    lastName: "lastName",
    firstName: "firstName",
    actions: "작업",
    delete: "삭제",
    deleting: "삭제 중...",
    deleteConfirm: "이 행을 삭제할까요?",
    deleteSuccess: "삭제되었습니다.",
    deleteFail: "삭제 실패"
  },
  ja: {
    title: "DynamoDB検索",
    query: "検索",
    loading: "検索中...",
    lastName: "姓",
    firstName: "名",
    actions: "操作",
    delete: "削除",
    deleting: "削除中...",
    deleteConfirm: "この行を削除しますか？",
    deleteSuccess: "削除しました。",
    deleteFail: "削除に失敗しました"
  }
};

// API Gateway GET 엔드포인트 (환경 변수로 주입)
const DYNAMO_API_URL = process.env.NEXT_PUBLIC_DYNAMO_SELECT_API_URL || "";
// CDK 배포 후 출력되는 DeleteUserApiEndpoint 값으로 교체하세요.
const DYNAMO_DELETE_API_URL = process.env.NEXT_PUBLIC_DYNAMO_DELETE_API_URL || "https://REPLACE_WITH_DELETE_API_ENDPOINT/delete-user";
const DELETE_ENDPOINT_NOT_CONFIGURED = DYNAMO_DELETE_API_URL.includes("REPLACE_WITH_DELETE_API_ENDPOINT") || DYNAMO_DELETE_API_URL.includes("replace_with_delete_api_endpoint");

interface UserRow {
  lastName: string;
  firstName: string;
}

function DynamoDBTable({ lang = "ja" }: { lang?: Lang }) {
  const [data, setData] = useState<UserRow[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setShowTable(false);
    try {
      const res = await fetch(DYNAMO_API_URL);
      const items = await res.json();
      // 방어 코드: 배열이 아니면 빈 배열로 처리
      setData(Array.isArray(items) ? items : []);
      setShowTable(true);
    } catch {
      alert("데이터 조회 실패");
      setData([]);
    }
    setLoading(false);
  };

  const handleDelete = async (row: UserRow) => {
    if (DELETE_ENDPOINT_NOT_CONFIGURED) {
      alert("삭제 API URL이 설정되지 않았습니다. NEXT_PUBLIC_DYNAMO_DELETE_API_URL 값을 설정해 주세요.");
      return;
    }

    if (!confirm(LABELS[lang].deleteConfirm)) {
      return;
    }

    const rowKey = `${row.lastName}#${row.firstName}`;
    setDeletingKey(rowKey);

    try {
      const res = await fetch(DYNAMO_DELETE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lastName: row.lastName,
          firstName: row.firstName
        })
      });

      if (!res.ok) {
        throw new Error("delete failed");
      }

      setData((prev) => prev.filter((item) => !(item.lastName === row.lastName && item.firstName === row.firstName)));
      alert(LABELS[lang].deleteSuccess);
    } catch {
      alert(LABELS[lang].deleteFail);
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "left", color: "#0f172a" }}>
        {LABELS[lang].title}
      </h1>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1.5rem" }}>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "0.5rem 1.25rem",
            borderRadius: "0.375rem",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "background 0.2s",
            lineHeight: "1.5",
            minWidth: "80px"
          }}
        >
          {loading ? LABELS[lang].loading : LABELS[lang].query}
        </button>
      </div>
      {showTable && (
        <table
          cellPadding="8"
          style={{
            margin: "0 auto",
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            border: "1px solid #cbd5e1"
          }}
        >
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={{ borderRight: "1px solid #cbd5e1", borderBottom: "1px solid #cbd5e1" }}>{LABELS[lang].lastName}</th>
              <th style={{ borderRight: "1px solid #cbd5e1", borderBottom: "1px solid #cbd5e1" }}>{LABELS[lang].firstName}</th>
              <th style={{ borderBottom: "1px solid #cbd5e1" }}>{LABELS[lang].actions}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td style={{ borderRight: "1px solid #cbd5e1", borderBottom: "1px solid #e5e7eb" }}>{row.lastName}</td>
                <td style={{ borderRight: "1px solid #cbd5e1", borderBottom: "1px solid #e5e7eb" }}>{row.firstName}</td>
                <td style={{ borderBottom: "1px solid #e5e7eb", textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(row)}
                    disabled={deletingKey === `${row.lastName}#${row.firstName}`}
                    style={{
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      padding: "0.35rem 0.8rem",
                      borderRadius: "0.375rem",
                      border: "none",
                      fontWeight: 600,
                      cursor: deletingKey === `${row.lastName}#${row.firstName}` ? "not-allowed" : "pointer"
                    }}
                  >
                    {deletingKey === `${row.lastName}#${row.firstName}` ? LABELS[lang].deleting : LABELS[lang].delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DynamoDBTable;
