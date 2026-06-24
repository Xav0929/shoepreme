"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const REGIONS = [
  {
    code: "JP",
    name: "JAPAN",
    tagline: "Harajuku & Shibuya pickups",
    color: "232,168,48",
    accent: "#e8a830",
  },
  {
    code: "TW",
    name: "TAIWAN",
    tagline: "Taipei sneaker district",
    color: "45,212,191",
    accent: "#2dd4bf",
  },
  {
    code: "HK",
    name: "HONG KONG",
    tagline: "Mongkok grail runs",
    color: "168,85,247",
    accent: "#a855f7",
  },
  {
    code: "US",
    name: "UNITED STATES",
    tagline: "Coast-to-coast restocks",
    color: "74,127,165",
    accent: "#4a7fa5",
  },
];

export default function PreOrderSection() {
  const [active, setActive] = useState(0);
  const cur = REGIONS[active];

  useEffect(() => {
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % REGIONS.length);
    }, 2400);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <section
      style={{
        padding: "clamp(64px, 9vw, 100px) 24px",
        background: "#0d1117",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0, rgba(255,255,255,0.012) 1px, transparent 0, transparent 50%)",
          backgroundSize: "30px 30px",
          pointerEvents: "none",
        }}
      />

      {/* ambient glow — shifts with selected region */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(${cur.color},0.1) 0%, transparent 70%)`,
          transition: "background 0.7s ease",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ position: "relative", maxWidth: "1100px", margin: "0 auto" }}
      >
        {/* Kicker */}
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: cur.accent,
            transition: "color 0.4s",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Sourcing Network
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            color: "#f5f7f9",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          PRE-ORDER FROM
          <br />
          <span style={{ color: cur.accent, transition: "color 0.4s" }}>
            ANYWHERE ON EARTH.
          </span>
        </h2>

        <p
          style={{
            color: "rgba(245,247,249,0.45)",
            fontSize: "15px",
            maxWidth: "460px",
            margin: "0 auto 56px",
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          Can&apos;t find your size locally? We source direct from overseas —
          authentic, at the best price, shipped straight to your door.
        </p>

        {/* Route visual */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            maxWidth: "640px",
            margin: "0 auto 40px",
          }}
        >
          {/* Origin node */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: `2px solid ${cur.accent}`,
              background: `rgba(${cur.color},0.12)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "1.1rem",
              color: cur.accent,
              transition: "all 0.4s",
              boxShadow: `0 0 24px rgba(${cur.color},0.35)`,
              flexShrink: 0,
            }}
          >
            {cur.code}
          </div>

          {/* Dashed line with flying dot */}
          <div
            style={{
              flex: 1,
              position: "relative",
              borderTop: `2px dashed rgba(${cur.color},0.3)`,
              transition: "border-color 0.4s",
            }}
          >
            <div
              key={active}
              style={{
                position: "absolute",
                top: "-9px",
                left: 0,
                animation: "flyAcross 2.2s ease-in-out forwards",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  filter: `drop-shadow(0 0 6px rgba(${cur.color},0.7))`,
                }}
              >
                <path
                  d="M12 2.5L4 7v10l8 4.5 8-4.5V7l-8-4.5z"
                  fill={`rgba(${cur.color},0.3)`}
                  stroke={cur.accent}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 7l8 4.5L20 7M12 11.5V21"
                  stroke={cur.accent}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Destination node */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "1.1rem",
              color: "rgba(245,247,249,0.6)",
              flexShrink: 0,
            }}
          >
            PH
          </div>
        </div>

        {/* Region selector chips */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {REGIONS.map((r, i) => {
            const isActive = i === active;
            return (
              <button
                key={r.code}
                onClick={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: `1px solid ${isActive ? r.accent : "rgba(255,255,255,0.1)"}`,
                  background: isActive
                    ? `rgba(${r.color},0.12)`
                    : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "0.85rem",
                    color: isActive ? r.accent : "rgba(245,247,249,0.4)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {r.code}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isActive
                      ? "rgba(245,247,249,0.7)"
                      : "rgba(245,247,249,0.25)",
                  }}
                >
                  {r.name}
                </span>
              </button>
            );
          })}
        </div>

        <p
          key={active}
          style={{
            textAlign: "center",
            color: "rgba(245,247,249,0.35)",
            fontSize: "12px",
            letterSpacing: "0.04em",
            marginBottom: "56px",
            animation: "fadeIn 0.35s ease",
          }}
        >
          {cur.tagline}
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/collections/pre-order"
            style={{
              background: "#e8a830",
              color: "#0d1117",
              fontWeight: 800,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "16px 36px",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Browse Pre-orders
          </Link>
          <Link
            href="https://m.me/shoepreme"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#f5f7f9",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "16px 36px",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Message Us
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes flyAcross {
          0% { left: 0%; opacity: 0; transform: scale(0.85); }
          8% { opacity: 1; transform: scale(1); }
          92% { opacity: 1; transform: scale(1); }
          100% { left: calc(100% - 20px); opacity: 0; transform: scale(0.85); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
