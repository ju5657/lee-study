import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";


const HeaderLangSelector: React.FC = () => {
  const { lang, setLang } = useLanguage();
  return (
    <header style={{ width: "100%", padding: "16px 0 0 0", display: "flex", justifyContent: "flex-end" }}>
      <select
        value={lang}
        onChange={e => setLang(e.target.value as "ko" | "ja")}
        style={{ fontSize: 16, padding: "4px 12px", borderRadius: 4, border: "1px solid #ccc" }}
      >
        <option value="ko">한국어</option>
        <option value="ja">日本語</option>
      </select>
    </header>
  );
};

export default HeaderLangSelector;
