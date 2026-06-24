"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/shopify";

const HOT_TAGS = [
  "Nike",
  "Adidas",
  "ASICS",
  "Hoka",
  "Brooks",
  "New Balance",
  "Saucony",
];

const RECENT_KEY = "sp_recent_searches";

type Product = {
  handle: string;
  title: string;
  vendor: string;
  images: { edges: { node: { url: string; altText: string } }[] };
  priceRange: { minVariantPrice: { amount: string } };
};

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function addRecent(q: string) {
  const prev = getRecent()
    .filter((s) => s !== q)
    .slice(0, 4);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev]));
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        style={{
          display: "block",
          width: "16px",
          height: "1px",
          background: "rgba(232,168,48,0.5)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: "9px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(232,168,48,0.55)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function ProductRow({
  p,
  i,
  onClick,
}: {
  p: Product;
  i: number;
  onClick: () => void;
}) {
  const price = `₱${parseFloat(
    p.priceRange.minVariantPrice.amount,
  ).toLocaleString("en-PH", { minimumFractionDigits: 0 })}`;

  return (
    <Link
      href={`/products/${p.handle}`}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "10px 0",
        borderTop: i !== 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
        textDecoration: "none",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "10px",
          overflow: "hidden",
          flexShrink: 0,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {p.images?.edges?.[0]?.node?.url ? (
          <img
            src={p.images.edges[0].node.url}
            alt={p.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1.5}
          >
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "10px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            color: "rgba(255,255,255,0.28)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            marginBottom: "3px",
          }}
        >
          {p.vendor}
        </p>
        <p
          style={{
            fontSize: "14px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            color: "rgba(245,247,249,0.92)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.3,
          }}
        >
          {p.title}
        </p>
      </div>

      {/* Price */}
      <span
        style={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          color: "#e8a830",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {price}
      </span>
    </Link>
  );
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllProducts(50).then((p: Product[]) => {
      setAll(p);
      setLoading(false);
    });
    setRecent(getRecent());
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      all
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.vendor?.toLowerCase().includes(q),
        )
        .slice(0, 8),
    );
  }, [query, all]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    addRecent(q.trim());
    window.location.href = `/products?q=${encodeURIComponent(q.trim())}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(5,8,15,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Ambient glow behind modal */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "80px",
          transform: "translateX(-50%)",
          zIndex: 91,
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,168,48,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "88px",
          transform: "translateX(-50%)",
          zIndex: 100,
          width: "100%",
          maxWidth: "660px",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            borderRadius: "18px",
            overflow: "hidden",
            background: "rgba(11,14,22,0.98)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 0 0 1px rgba(232,168,48,0.06), 0 24px 60px rgba(0,0,0,0.75), 0 8px 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* ── Search bar ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              height: "66px",
              padding: "0 20px",
              borderBottom: "1px solid rgba(255,255,255,0.055)",
            }}
          >
            {/* Search icon */}
            <svg
              width="17"
              height="17"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgba(245,247,249,0.3)"
              strokeWidth={2.2}
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              placeholder="Search shoes, brands…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "15px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                color: "#f5f7f9",
                caretColor: "#e8a830",
              }}
            />

            {/* Clear */}
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "none",
                  borderRadius: "6px",
                  width: "26px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  color: "rgba(255,255,255,0.45)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
                }
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {/* ESC badge */}
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Esc
            </button>
          </div>

          {/* ── Content ── */}
          <div
            style={{
              padding: "20px 20px 24px",
              maxHeight: "62vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* ── Search results state ── */}
            {query ? (
              <>
                {loading ? (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "32px 0",
                      fontSize: "12px",
                      fontFamily: "Poppins, sans-serif",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    Loading…
                  </p>
                ) : results.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontFamily: "Poppins, sans-serif",
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: "6px",
                      }}
                    >
                      No results for{" "}
                      <span style={{ color: "#e8a830" }}>"{query}"</span>
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Poppins, sans-serif",
                        color: "rgba(255,255,255,0.18)",
                      }}
                    >
                      Try a different brand or shoe name
                    </p>
                  </div>
                ) : (
                  <div>
                    <SectionLabel>
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </SectionLabel>
                    <div>
                      {results.map((p, i) => (
                        <ProductRow
                          key={p.handle}
                          p={p}
                          i={i}
                          onClick={() => {
                            addRecent(query);
                            onClose();
                          }}
                        />
                      ))}
                    </div>

                    {/* See all CTA */}
                    <button
                      onClick={() => handleSearch(query)}
                      style={{
                        marginTop: "14px",
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: "rgba(232,168,48,0.08)",
                        border: "1px solid rgba(232,168,48,0.18)",
                        color: "#e8a830",
                        fontSize: "11px",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "background 0.15s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(232,168,48,0.14)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(232,168,48,0.08)")
                      }
                    >
                      See all results for "{query}"
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* ── Empty state ── */
              <>
                {/* Recent searches */}
                {recent.length > 0 && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <SectionLabel>Recent</SectionLabel>
                      <button
                        onClick={() => {
                          localStorage.removeItem(RECENT_KEY);
                          setRecent([]);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "10px",
                          fontFamily: "Poppins, sans-serif",
                          color: "rgba(255,255,255,0.22)",
                          letterSpacing: "0.06em",
                          marginBottom: "4px",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color =
                            "rgba(255,255,255,0.55)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            "rgba(255,255,255,0.22)")
                        }
                      >
                        Clear
                      </button>
                    </div>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQuery(r)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            padding: "7px 13px",
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "12px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.08)";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.85)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.5)";
                          }}
                        >
                          <svg
                            width="11"
                            height="11"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              strokeLinecap="round"
                            />
                          </svg>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hot Brands */}
                <div>
                  <SectionLabel>Hot Brands</SectionLabel>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {HOT_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          background: "rgba(232,168,48,0.07)",
                          border: "1px solid rgba(232,168,48,0.16)",
                          color: "rgba(232,168,48,0.8)",
                          fontSize: "11px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(232,168,48,0.14)";
                          e.currentTarget.style.color = "#e8a830";
                          e.currentTarget.style.borderColor =
                            "rgba(232,168,48,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(232,168,48,0.07)";
                          e.currentTarget.style.color = "rgba(232,168,48,0.8)";
                          e.currentTarget.style.borderColor =
                            "rgba(232,168,48,0.16)";
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* New In Stock */}
                {!loading && all.length > 0 && (
                  <div>
                    <SectionLabel>New In Stock</SectionLabel>
                    <div>
                      {all.slice(0, 4).map((p, i) => (
                        <ProductRow
                          key={p.handle}
                          p={p}
                          i={i}
                          onClick={onClose}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
