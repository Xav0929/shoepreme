"use client";
import { useState } from "react";

const MILESTONES = [
  {
    year: "2019",
    tag: "ORIGIN",
    title: "FIRST STORE",
    sub: "Koronadal City",
    body: "Not a warehouse. Not a mall kiosk. A real store, built by runners, for runners — right in the middle of South Cotabato.",
    color: "74,127,165",
    accent: "#4a7fa5",
    jp: "最初の店",
  },
  {
    year: "2022",
    tag: "COMMUNITY",
    title: "FIRST RACE",
    sub: "Sponsorship",
    body: "Became the official gear sponsor for local South Cotabato road races. We weren't watching from the sideline — we were in the pack.",
    color: "232,168,48",
    accent: "#e8a830",
    jp: "コミュニティ",
  },
  {
    year: "2024",
    tag: "GLOBAL",
    title: "DIRECT SOURCE",
    sub: "JP · TW · HK · US",
    body: "Cut every middleman. Pre-orders straight from Japan, Taiwan, Hong Kong, and the US. Authentic pairs, honest prices.",
    color: "45,212,191",
    accent: "#2dd4bf",
    jp: "直輸入",
  },
  {
    year: "2025",
    tag: "DIGITAL",
    title: "ONLINE DROP",
    sub: "Shoepreme.shop",
    body: "The store goes nationwide. Same authenticity guarantee, same community energy — now anyone in the Philippines can cop.",
    color: "168,85,247",
    accent: "#a855f7",
    jp: "オンライン",
  },
  {
    year: "2026",
    tag: "PEAK",
    title: "MATUTUM",
    sub: "Mountain Marathon",
    body: "Title sponsor. Toughest race in Mindanao. We trained for it. We ran it. We'll be at the next one — will you?",
    color: "239,68,68",
    accent: "#ef4444",
    jp: "山の頂上",
  },
];

export default function StorySection() {
  const [active, setActive] = useState(0);
  const cur = MILESTONES[active];

  return (
    <section
      style={{
        background: "#060b14",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scanline texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Ambient color bleed */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 55% 55% at 75% 50%, rgba(${cur.color},0.12) 0%, transparent 65%)`,
          transition: "background 0.8s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Large JP watermark */}
      <div
        style={{
          position: "absolute",
          right: "-2%",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(140px, 22vw, 320px)",
          color: `rgba(${cur.color},0.04)`,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
          transition: "color 0.8s ease",
          whiteSpace: "nowrap",
        }}
      >
        {cur.jp}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
        }}
        className="story-azuki-grid"
      >
        {/* ── LEFT PANEL ── */}
        <div
          style={{
            paddingTop: "clamp(48px, 8vw, 96px)",
            paddingBottom: "clamp(48px, 8vw, 96px)",
            paddingLeft: "0",
            paddingRight: "clamp(24px, 4vw, 56px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Kicker */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: "28px",
                height: "1px",
                background: cur.accent,
                display: "block",
                transition: "background 0.4s",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: cur.accent,
                transition: "color 0.4s",
              }}
            >
              Our Story
            </span>
          </div>

          {/* Big headline */}
          <h2
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(3.2rem, 6vw, 5.5rem)",
              color: "#f5f7f9",
              lineHeight: 0.92,
              letterSpacing: "-0.01em",
              marginBottom: "28px",
            }}
          >
            WE RAN AT
            <br />
            <span
              style={{
                WebkitTextStroke: `2px ${cur.accent}`,
                color: "transparent",
                transition: "all 0.4s ease",
              }}
            >
              MATUTUM.
            </span>
            <br />
            <span style={{ color: "#e8a830" }}>WE'LL BE AT</span>
            <br />
            THE NEXT ONE.
          </h2>

          <p
            style={{
              color: "rgba(245,247,249,0.4)",
              fontSize: "13px",
              lineHeight: 1.8,
              maxWidth: "400px",
              marginBottom: "40px",
            }}
          >
            Shoepreme started in Koronadal — a real store built by runners. We
            sponsor local races because we&apos;re in them too.
          </p>

          {/* Stat pills */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["100% Authentic", "PH Nationwide", "JP · TW · US Direct"].map(
              (s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(245,247,249,0.45)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {s}
                </span>
              ),
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          style={{
            paddingTop: "clamp(48px, 8vw, 96px)",
            paddingBottom: "clamp(48px, 8vw, 96px)",
            paddingLeft: "clamp(24px, 4vw, 56px)",
            paddingRight: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0",
          }}
        >
          {/* Section label */}
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(245,247,249,0.2)",
              marginBottom: "24px",
            }}
          >
            Timeline · {MILESTONES.length} Chapters
          </p>

          {/* Milestone rows */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {MILESTONES.map((m, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="story-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr",
                    gap: "16px",
                    alignItems: "stretch",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    textAlign: "left",
                    position: "relative",
                    borderRadius: "8px",
                  }}
                >
                  {/* Year + line */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "0.78rem",
                        color: isActive ? m.accent : "rgba(245,247,249,0.18)",
                        letterSpacing: "0.06em",
                        transition: "color 0.3s",
                        lineHeight: 1,
                        paddingTop: "20px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.year}
                    </span>
                    {i < MILESTONES.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          width: "1px",
                          background: isActive
                            ? `rgba(${m.color},0.4)`
                            : "rgba(255,255,255,0.06)",
                          marginTop: "6px",
                          transition: "background 0.3s",
                          minHeight: "24px",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      borderLeft: `2px solid ${isActive ? m.accent : "transparent"}`,
                      paddingLeft: "16px",
                      paddingTop: "16px",
                      paddingBottom: i < MILESTONES.length - 1 ? "16px" : "0",
                      transition: "border-color 0.3s",
                    }}
                  >
                    {/* Tag */}
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "monospace",
                        fontSize: "7.5px",
                        fontWeight: 800,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: isActive ? m.accent : "rgba(245,247,249,0.2)",
                        marginBottom: "4px",
                        transition: "color 0.3s",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} — {m.tag}
                    </span>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: isActive ? "1.6rem" : "1.2rem",
                        color: isActive ? "#f5f7f9" : "rgba(245,247,249,0.3)",
                        lineHeight: 1,
                        letterSpacing: "0.03em",
                        marginBottom: isActive ? "6px" : "0",
                        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {m.title}
                      <span
                        style={{
                          color: m.accent,
                          marginLeft: "8px",
                          fontSize: "0.8em",
                          opacity: isActive ? 1 : 0,
                          transition: "opacity 0.3s",
                        }}
                      >
                        / {m.sub}
                      </span>
                    </h3>

                    {/* Body — only active */}
                    <div
                      style={{
                        maxHeight: isActive ? "120px" : "0",
                        overflow: "hidden",
                        transition:
                          "max-height 0.45s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <p
                        style={{
                          color: "rgba(245,247,249,0.45)",
                          fontSize: "12.5px",
                          lineHeight: 1.7,
                          margin: "0 0 4px",
                          paddingRight: "16px",
                        }}
                      >
                        {m.body}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .story-row {
          transition: background 0.2s ease;
        }
        .story-row:hover {
          background: rgba(255,255,255,0.025) !important;
        }
        @media (max-width: 768px) {
          .story-azuki-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
