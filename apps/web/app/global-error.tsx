"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary that catches errors in the root layout.
 * This is a fallback when the regular error boundary fails.
 *
 * Note: This file must include its own <html> and <body> tags
 * because it replaces the root layout when an error occurs.
 *
 * @see https://nextjs.org/docs/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error to monitoring service
    console.error("Critical application error:", error);

    // TODO: Send to error monitoring service with high priority
    // Example: Sentry.captureException(error, { level: 'fatal' });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#f9fafb",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              padding: "2rem",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "9999px",
                  backgroundColor: "#fee2e2",
                  marginBottom: "1rem",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  role="img"
                  aria-label="Warning icon"
                >
                  <title>Warning</title>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
                Critical Error
              </h1>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                The application encountered a critical error and needs to restart
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.375rem",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#991b1b", marginBottom: "0.5rem" }}>
                Error Details:
              </p>
              <code
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#7f1d1d",
                  backgroundColor: "#fee2e2",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {error.message || "Unknown error"}
              </code>
              {error.digest && (
                <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
                  Error ID:{" "}
                  <code style={{ backgroundColor: "#f3f4f6", padding: "0.125rem 0.375rem" }}>{error.digest}</code>
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  flex: 1,
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "0.625rem 1rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  color: "#374151",
                  padding: "0.625rem 1rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
