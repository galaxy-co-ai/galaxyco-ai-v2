"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import {
  colors,
  spacing,
  typography,
  radius,
} from "@/lib/constants/design-system";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.background.tertiary,
        padding: spacing["2xl"],
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          background: colors.background.primary,
          padding: spacing["2xl"],
          borderRadius: radius.lg,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: spacing.lg }}>⚠️</div>
        <h2
          style={{
            fontSize: typography.sizes["2xl"],
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontSize: typography.sizes.base,
            color: colors.text.secondary,
            marginBottom: spacing.xl,
          }}
        >
          We've been notified and are looking into it. Please try again.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: typography.sizes.sm,
              color: colors.text.tertiary,
              marginBottom: spacing.lg,
              fontFamily: "monospace",
            }}
          >
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            background: colors.primary[500],
            color: "white",
            padding: `${spacing.sm} ${spacing.xl}`,
            borderRadius: radius.md,
            border: "none",
            fontSize: typography.sizes.base,
            fontWeight: typography.weights.medium,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
