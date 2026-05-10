"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck, Settings2 } from "lucide-react";

const CONSENT_KEY = "gdpr_consent_v1";

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
};

function getStored(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(state: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStored();
    if (!stored || !stored.decided) {
      // Short delay so the page loads first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true, decided: true });
    setVisible(false);
  };

  const rejectNonEssential = () => {
    saveConsent({ analytics: false, marketing: false, decided: true });
    setVisible(false);
  };

  const saveCustom = () => {
    saveConsent({ analytics, marketing, decided: true });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop blur on mobile when details open */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[900] bg-slate-950/40 backdrop-blur-sm sm:hidden"
              onClick={() => setShowDetails(false)}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed bottom-4 left-4 right-4 z-[950] sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md"
            role="dialog"
            aria-label="Cookie consent"
            aria-modal="true"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-2xl dark:border-slate-700/60 dark:bg-slate-900">
              {/* Gradient accent stripe */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500" />

              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md">
                      <Cookie className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        We value your privacy
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        GDPR — your data, your choice
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={rejectNonEssential}
                    aria-label="Reject non-essential cookies and close"
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body */}
                {!showDetails ? (
                  <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    We use cookies to ensure essential site functionality and, with your
                    consent, to analyse usage and improve your experience. We never sell
                    your data. See our{" "}
                    <Link
                      href="/cookies"
                      className="font-semibold text-amber-600 underline-offset-2 hover:underline dark:text-amber-400"
                    >
                      Cookie Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-amber-600 underline-offset-2 hover:underline dark:text-amber-400"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {/* Essential — always on */}
                    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Essential Cookies
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Authentication, security, session management. Always active.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Always On
                        </span>
                      </div>
                    </div>

                    {/* Analytics */}
                    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Analytics Cookies
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Help us understand how visitors use our site (page views, traffic sources).
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
                      />
                    </label>

                    {/* Marketing */}
                    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Marketing Cookies
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Used to display relevant content on social and partner platforms.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={marketing}
                        onChange={(e) => setMarketing(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
                      />
                    </label>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    id="cookie-accept-all"
                    onClick={acceptAll}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/25 transition-all hover:opacity-90 active:scale-95"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Accept All
                  </button>

                  {showDetails ? (
                    <button
                      id="cookie-save-custom"
                      onClick={saveCustom}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Save My Choices
                    </button>
                  ) : (
                    <button
                      id="cookie-reject-non-essential"
                      onClick={rejectNonEssential}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Essential Only
                    </button>
                  )}
                </div>

                {/* Manage preferences toggle */}
                <button
                  id="cookie-manage-preferences"
                  onClick={() => setShowDetails((v) => !v)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 transition-colors hover:text-amber-500"
                >
                  <Settings2 className="h-3 w-3" />
                  {showDetails ? "Hide preferences" : "Manage preferences"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
