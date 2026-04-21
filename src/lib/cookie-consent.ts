export const COOKIE_CONSENT_STORAGE_KEY = "sgm_cookie_consent_v1";
export const OPEN_COOKIE_SETTINGS_EVENT = "sgm-open-cookie-settings";
export const COOKIE_CONSENT_UPDATED_EVENT = "sgm-cookie-consent-updated";

export type ConsentStatus = "granted" | "denied" | "partial";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
};

export type CookieConsentRecord = {
  status: ConsentStatus;
  categories: ConsentCategories;
  timestamp: string;
  policyVersion: string;
};

export const COOKIE_POLICY_VERSION = "2026-04-20";

export const DEFAULT_CONSENT_CATEGORIES: ConsentCategories = {
  necessary: true,
  analytics: false,
  personalization: false,
  marketing: false,
};

function isConsentStatus(value: string): value is ConsentStatus {
  return value === "granted" || value === "denied" || value === "partial";
}

function hasConsentCategoriesShape(value: unknown): value is ConsentCategories {
  if (!value || typeof value !== "object") {
    return false;
  }

  const categories = value as Partial<ConsentCategories>;
  return (
    categories.necessary === true &&
    typeof categories.analytics === "boolean" &&
    typeof categories.personalization === "boolean" &&
    typeof categories.marketing === "boolean"
  );
}

export function computeConsentStatus(
  categories: ConsentCategories,
): ConsentStatus {
  const optionalValues = [
    categories.analytics,
    categories.personalization,
    categories.marketing,
  ];
  const enabledCount = optionalValues.filter(Boolean).length;

  if (enabledCount === 0) {
    return "denied";
  }

  if (enabledCount === optionalValues.length) {
    return "granted";
  }

  return "partial";
}

export function createConsentRecord(
  categories: ConsentCategories,
): CookieConsentRecord {
  return {
    status: computeConsentStatus(categories),
    categories,
    timestamp: new Date().toISOString(),
    policyVersion: COOKIE_POLICY_VERSION,
  };
}

export function parseConsentRecord(rawValue: string): CookieConsentRecord | null {
  try {
    const parsed = JSON.parse(rawValue) as Partial<CookieConsentRecord>;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.status ||
      !isConsentStatus(parsed.status) ||
      !parsed.categories ||
      !hasConsentCategoriesShape(parsed.categories) ||
      typeof parsed.timestamp !== "string" ||
      typeof parsed.policyVersion !== "string"
    ) {
      return null;
    }

    return {
      status: parsed.status,
      categories: parsed.categories,
      timestamp: parsed.timestamp,
      policyVersion: parsed.policyVersion,
    };
  } catch {
    return null;
  }
}

export function readConsentFromStorage(): CookieConsentRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!value) {
    return null;
  }

  return parseConsentRecord(value);
}

export function writeConsentToStorage(record: CookieConsentRecord): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: record }),
  );
}
