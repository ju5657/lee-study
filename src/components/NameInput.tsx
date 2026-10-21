import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LAMBDA_API_URL = process.env.NEXT_PUBLIC_SPLIT_NAME_API_URL || "";

const NameInput: React.FC = () => {
  const { lang } = useLanguage();
  const [name, setName] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(LAMBDA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(
          lang === 'ko'
            ? `성: ${data.lastName}, 이름: ${data.firstName}`
            : `姓: ${data.lastName}, 名: ${data.firstName}`
        );
      } else {
        setResult(lang === 'ko' ? (data.message || '분리 실패') : (data.message || '分離失敗'));
      }
    } catch {
      setResult('에러 발생');
    }
    setLoading(false);
    setName('');
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">
        {lang === 'ko' ? 'ApiGateway 랑 Lamda 접속테스트' : 'ApiGatewayとLamda接続テスト'}
      </h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label htmlFor="name-input" style={{ marginBottom: 8 }}>
          {lang === 'ko' ? '이름을 입력하세요:' : '名前を入力してください:'}
        </label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={lang === 'ko' ? '예: 이현주' : '例: イ・ヒョンジュ'}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 8 }}
          disabled={loading}
        />
        <button type="submit" style={{ padding: '6px 16px', borderRadius: 4, background: '#0070f3', color: '#fff', border: 'none' }} disabled={loading}>
          {loading ? (lang === 'ko' ? '전송 중...' : '送信中...') : (lang === 'ko' ? '제출' : '送信')}
        </button>
        {result && <div style={{ marginTop: 16 }}>{result}</div>}
      </form>
    </div>
  );
};

export default NameInput;
