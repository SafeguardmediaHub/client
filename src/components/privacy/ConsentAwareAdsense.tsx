"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  readConsentFromStorage,
} from "@/lib/cookie-consent";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3526860570408649";

export default function ConsentAwareAdsense() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const updateFromStorage = () => {
      const consent = readConsentFromStorage();
      setEnabled(Boolean(consent?.categories.marketing));
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

  return (
    <Script
      id="consent-aware-adsense"
      src={ADSENSE_SRC}
      async
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
