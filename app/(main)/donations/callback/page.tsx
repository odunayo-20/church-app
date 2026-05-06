"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function DonationCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  const reference = searchParams.get("reference");

  const verifyPayment = useCallback(async (ref: string) => {
    try {
      const response = await fetch(`/api/donations/verify?reference=${ref}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Verification failed");
      }

      if (result.data.status === "completed") {
        setStatus("success");
        setMessage(
          "Your donation was successful! Thank you for your generosity.",
        );
      } else {
        setStatus("failed");
        setMessage(
          "Payment verification failed. Please contact support if this persists.",
        );
      }
    } catch (error) {
      setStatus("failed");
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while verifying your payment.",
      );
    }
  }, []);

  useEffect(() => {
    if (reference && !hasVerified.current) {
      hasVerified.current = true;
      verifyPayment(reference);
    }
  }, [reference, verifyPayment]);

  if (!reference) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold">Invalid Payment</h1>
        <p className="mt-2 text-center text-muted-foreground max-w-md">
          No payment reference found.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/donate"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Donate Again
          </Link>
          <Link
            href="/"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {status === "success" ? (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Thank You!</h1>
          <p className="mt-2 text-center text-muted-foreground max-w-md">
            {message}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Reference: {reference}
          </p>
        </>
      ) : (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Payment Failed</h1>
          <p className="mt-2 text-center text-muted-foreground max-w-md">
            {message}
          </p>
        </>
      )}

      <div className="mt-8 flex gap-4">
        <Link
          href="/donate"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Donate Again
        </Link>
        <Link
          href="/"
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function DonationCallbackPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <DonationCallbackContent />
      </Suspense>
    </div>
  );
}
