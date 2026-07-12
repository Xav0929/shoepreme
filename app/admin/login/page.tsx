"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsPending(true);

const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });
    const data = await res.json();
    if (data.success) {
      document.cookie = `demo-admin-session=${encodeURIComponent(
        JSON.stringify({ name: data.name, role: data.role }),
      )}; path=/; max-age=86400`;
      document.cookie = `admin-session-token=${data.sessionToken}; path=/; max-age=86400; SameSite=Strict`;
      // Small delay to ensure cookie is set before redirect
      await new Promise((resolve) => setTimeout(resolve, 100));
      window.location.href = "/admin";
      return;
    }
    setError("Invalid username or password.");
    setIsPending(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090c12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,168,48,0.08) 0%, transparent 65%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src="/logo.png"
            alt="Shoepreme"
            width={40}
            height={40}
            style={{ objectFit: "contain", margin: "0 auto 14px" }}
          />
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(240,244,248,0.3)",
              marginBottom: "8px",
            }}
          >
            Staff Access
          </p>
          <h1
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "2.4rem",
              letterSpacing: "0.04em",
              color: "#f0f4f8",
              margin: 0,
            }}
          >
            Admin <span style={{ color: "#e8a830" }}>Sign In</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {error && (
            <div
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#f87171",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#f87171",
                  letterSpacing: "0.02em",
                }}
              >
                {error}
              </span>
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(240,244,248,0.4)",
                marginBottom: "8px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px 14px",
                color: "#f0f4f8",
                fontFamily: "monospace",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(240,244,248,0.4)",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px 14px",
                color: "#f0f4f8",
                fontFamily: "monospace",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: "6px",
              background: isPending ? "rgba(232,168,48,0.5)" : "#e8a830",
              color: "#0d1117",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "14px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: isPending ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontFamily: "monospace",
            fontSize: "9px",
            color: "rgba(240,244,248,0.25)",
            letterSpacing: "0.05em",
          }}
        >
          Authorized personnel only
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={<div style={{ minHeight: "100vh", background: "#090c12" }} />}
    >
      <AdminLoginForm />
    </Suspense>
  );
}
