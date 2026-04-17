"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AnonymousMeta {
  triesUsed: number;
  triesRemaining: number;
  requiresSignup: boolean;
}

interface AnonymousSessionContextValue {
  meta: AnonymousMeta;
  isLoading: boolean;
  updateFromResponse: (anonymous: AnonymousMeta) => void;
  showSignupModal: boolean;
  setShowSignupModal: (v: boolean) => void;
}

const TOTAL_TRIES = 3;

const defaultMeta: AnonymousMeta = {
  triesUsed: 0,
  triesRemaining: TOTAL_TRIES,
  requiresSignup: false,
};

const AnonymousSessionContext = createContext<AnonymousSessionContextValue>({
  meta: defaultMeta,
  isLoading: true,
  updateFromResponse: () => {},
  showSignupModal: false,
  setShowSignupModal: () => {},
});

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";

export function AnonymousSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [meta, setMeta] = useState<AnonymousMeta>(defaultMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/anonymous/status`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const data = json.data;
          setMeta({
            triesUsed: data.triesUsed,
            triesRemaining: data.triesRemaining,
            requiresSignup: data.requiresSignup,
          });
          if (data.requiresSignup) setShowSignupModal(true);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // triesRemaining in response = ground truth after this request
  // triesUsed in response lags by one; compute from triesRemaining instead
  const updateFromResponse = useCallback((anonymous: AnonymousMeta) => {
    const remaining = anonymous.triesRemaining;
    const updated: AnonymousMeta = {
      triesUsed: TOTAL_TRIES - remaining,
      triesRemaining: remaining,
      requiresSignup: anonymous.requiresSignup,
    };
    setMeta(updated);
    if (remaining <= 0 || anonymous.requiresSignup) {
      // Delay so results render before the modal appears
      setTimeout(() => setShowSignupModal(true), 2000);
    }
  }, []);

  return (
    <AnonymousSessionContext.Provider
      value={{
        meta,
        isLoading,
        updateFromResponse,
        showSignupModal,
        setShowSignupModal,
      }}
    >
      {children}
    </AnonymousSessionContext.Provider>
  );
}

export function useAnonymousSession() {
  return useContext(AnonymousSessionContext);
}
