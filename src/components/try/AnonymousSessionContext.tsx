"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type AnonymousShape = {
  mode: "anonymous";
  triesUsed: number;
  triesRemaining: number;
  requiresSignup: boolean;
  anonymousId?: string;
};

export type AuthenticatedShape = {
  mode: "authenticated";
  analysesUsed: number;
  analysesRemaining: number;
  requiresUpgrade: boolean;
  dashboardMode: "simple" | "full";
};

export type SessionMeta = AnonymousShape | AuthenticatedShape;

// Raw shapes returned in response.anonymous after analysis calls
type AnonymousResponseMeta = {
  triesUsed: number;
  triesRemaining: number;
  requiresSignup: boolean;
};
type AuthenticatedResponseMeta = {
  analysesUsed: number;
  analysesRemaining: number;
  requiresUpgrade: boolean;
};
export type ResponseMeta = AnonymousResponseMeta | AuthenticatedResponseMeta;

interface AnonymousSessionContextValue {
  meta: SessionMeta;
  isLoading: boolean;
  updateFromResponse: (anonymous: ResponseMeta) => void;
  showSignupModal: boolean;
  setShowSignupModal: (v: boolean) => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (v: boolean) => void;
}

const TOTAL_TRIES = 3;

const defaultMeta: SessionMeta = {
  mode: "anonymous",
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
  showUpgradeModal: false,
  setShowUpgradeModal: () => {},
});

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";

export function AnonymousSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [meta, setMeta] = useState<SessionMeta>(defaultMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/anonymous/status`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const data = json.data;
          if ("dashboardMode" in data) {
            setMeta({
              mode: "authenticated",
              analysesUsed: data.analysesUsed,
              analysesRemaining: data.analysesRemaining,
              requiresUpgrade: data.requiresUpgrade,
              dashboardMode: data.dashboardMode,
            });
            if (data.requiresUpgrade) setShowUpgradeModal(true);
          } else {
            setMeta({
              mode: "anonymous",
              triesUsed: data.triesUsed,
              triesRemaining: data.triesRemaining,
              requiresSignup: data.requiresSignup,
              anonymousId: data.anonymousId,
            });
            if (data.requiresSignup) setShowSignupModal(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // triesRemaining / analysesRemaining in response = ground truth after this request
  const updateFromResponse = useCallback((anonymous: ResponseMeta) => {
    if ("triesRemaining" in anonymous) {
      const remaining = anonymous.triesRemaining;
      setMeta((prev) => ({
        mode: "anonymous",
        triesUsed: TOTAL_TRIES - remaining,
        triesRemaining: remaining,
        requiresSignup: anonymous.requiresSignup,
        anonymousId: prev.mode === "anonymous" ? prev.anonymousId : undefined,
      }));
      if (remaining <= 0 || anonymous.requiresSignup) {
        setTimeout(() => setShowSignupModal(true), 2000);
      }
    } else {
      setMeta((prev) => ({
        mode: "authenticated",
        analysesUsed: anonymous.analysesUsed,
        analysesRemaining: anonymous.analysesRemaining,
        requiresUpgrade: anonymous.requiresUpgrade,
        dashboardMode:
          prev.mode === "authenticated" ? prev.dashboardMode : "simple",
      }));
      if (anonymous.requiresUpgrade) {
        setTimeout(() => setShowUpgradeModal(true), 2000);
      }
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
        showUpgradeModal,
        setShowUpgradeModal,
      }}
    >
      {children}
    </AnonymousSessionContext.Provider>
  );
}

export function useAnonymousSession() {
  return useContext(AnonymousSessionContext);
}
