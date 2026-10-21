"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CognitoContextType {
  isLoggedIn: boolean;
  user: unknown;
  loading: boolean;
  signOut: () => void;
}

const CognitoContext = createContext<CognitoContextType | undefined>(
  undefined
);

export function CognitoProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        // 코드가 있으면 이미 로그인됨
        setIsLoggedIn(true);
        // URL에서 code 제거
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <CognitoContext.Provider value={{ isLoggedIn, user, loading, signOut }}>
      {children}
    </CognitoContext.Provider>
  );
}

export function useCognito() {
  const context = useContext(CognitoContext);
  if (context === undefined) {
    throw new Error("useCognito must be used within CognitoProvider");
  }
  return context;
}
