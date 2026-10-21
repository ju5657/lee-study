"use client";
import React, { createContext, useContext, useState } from "react";

export type Lang = "ko" | "ja";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "ko", setLang: () => {} });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("ko");
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
