"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  DEFAULT_CONSENT_CATEGORIES,
  OPEN_COOKIE_SETTINGS_EVENT,
  type ConsentCategories,
  createConsentRecord,
  readConsentFromStorage,
  writeConsentToStorage,
} from "@/lib/cookie-consent";

const categoryCopy = {
  analytics: "Help us understand performance and usage trends.",
  personalization: "Remember preferences to improve your experience.",
  marketing: "Support campaign attribution and marketing performance.",
};

export default function CookieConsentManager() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>(
    DEFAULT_CONSENT_CATEGORIES,
  );

  useEffect(() => {
    const existing = readConsentFromStorage();
    if (existing) {
      setCategories(existing.categories);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const openSettings = () => {
      const existing = readConsentFromStorage();
      if (existing) {
        setCategories(existing.categories);
      }
      setIsDialogOpen(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const hasOptionalEnabled = useMemo(
    () => categories.analytics || categories.personalization || categories.marketing,
    [categories],
  );

  const persist = (nextCategories: ConsentCategories) => {
    writeConsentToStorage(createConsentRecord(nextCategories));
    setCategories(nextCategories);
    setShowBanner(false);
    setIsDialogOpen(false);
  };

  const acceptAll = () =>
    persist({
      necessary: true,
      analytics: true,
      personalization: true,
      marketing: true,
    });

  const rejectOptional = () => persist(DEFAULT_CONSENT_CATEGORIES);

  const savePreferences = () =>
    persist({
      necessary: true,
      analytics: categories.analytics,
      personalization: categories.personalization,
      marketing: categories.marketing,
    });

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <section className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">
                We use cookies to run Safeguardmedia responsibly
              </h2>
              <p className="text-sm text-slate-600">
                Necessary cookies keep core features secure and working. Optional
                categories help with analytics, personalization, and campaign
                insights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
                className="w-full"
              >
                Manage preferences
              </Button>
              <Button variant="outline" onClick={rejectOptional} className="w-full">
                Reject optional
              </Button>
              <Button onClick={acceptAll} className="col-span-2 justify-self-center">
                Accept all
              </Button>
            </div>
          </div>
        </section>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Control optional cookie categories. Necessary cookies are always enabled
              for authentication, session integrity, and security.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Necessary cookies
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Required for core login, session, and service reliability.
                  </p>
                </div>
                <Switch checked disabled aria-label="Necessary cookies always on" />
              </div>
            </div>

            {(
              Object.keys(categoryCopy) as Array<keyof typeof categoryCopy>
            ).map((category) => (
              <div key={category} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium capitalize text-slate-900">
                      {category}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {categoryCopy[category]}
                    </p>
                  </div>
                  <Switch
                    checked={categories[category]}
                    onCheckedChange={(checked) =>
                      setCategories((prev) => ({ ...prev, [category]: checked }))
                    }
                    aria-label={`${category} cookies`}
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={rejectOptional}>
              Reject optional
            </Button>
            <Button variant="outline" onClick={acceptAll}>
              Accept all
            </Button>
            <Button onClick={savePreferences}>
              Save preferences
              {!hasOptionalEnabled ? " (necessary only)" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
