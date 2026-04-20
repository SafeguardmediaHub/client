"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  readConsentFromStorage,
} from "@/lib/cookie-consent";

export default function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const updateFromStorage = () => {
      const consent = readConsentFromStorage();
      setEnabled(Boolean(consent?.categories.analytics));
    };

    updateFromStorage();

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, updateFromStorage);
    window.addEventListener("storage", updateFromStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, updateFromStorage);
      window.removeEventListener("storage", updateFromStorage);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Analytics />;
}
