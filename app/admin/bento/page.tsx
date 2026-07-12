"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useToast,
  Toast,
  ActionButton,
  Spinner,
} from "@/lib/admin-ui";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface BentoPhoto {
  index: number;       // 0–8, maps to BENTO array positions
  src: string | null;
  label: string;
  caption: string;
  size: "hero" | "sm";
}

// ─────────────────────────────────────────────────────────────────────────────
// Default tile metadata (mirrors the BENTO const in the storefront)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_BENTO: Omit<BentoPhoto, "src">[] = [
  { index: 0, label: "First Crew Run · Jun 15", caption: "Koronadal Oval",   size: "hero" },
  { index: 1, label: "Drop Night",              caption: "Shoepreme Store",  size: "sm" },
  { index: 2, label: "Race Day",                caption: "GenSan Oval",      size: "sm" },
  { index: 3, label: "Morning 5K",              caption: "Sports Complex",   size: "sm" },
  { index: 4, label: "Crew Collab",             caption: "Koronadal City",   size: "sm" },
  { index: 5, label: "Sunset Loop",             caption: "Marbel Riverside", size: "sm" },
  { index: 6, label: "Trail Session",           caption: "Lake Sebu",        size: "sm" },
  { index: 7, label: "Podium Finish",           caption: "Koronadal City",   size: "sm" },
  { index: 8, label: "Rest Day Fits",           caption: "Crew HQ",          size: "sm" },
];

// ─────────────────────────────────────────────────────────────────────────────
// BentoAdminTile
// ─────────────────────────────────────────────────────────────────────────────
function BentoAdminTile({
  photo,
  onUpload,
  onRemove,
  onEditMeta,
  uploading,
}: {
  photo: BentoPhoto;
  onUpload: (index: number, file: File) => void;
  onRemove: (index: number) => void;
  onEditMeta: (index: number) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isHero = photo.size === "hero";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        background: isHero ? "rgba(232,168,48,0.04)" : "rgba(255,255,255,0.03)",
        border: isHero
          ? "1px solid rgba(232,168,48,0.18)"
          : "1px solid rgba(255,255,255,0.07)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Photo area ── */}
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        {photo.src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo.src}
            alt={photo.label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          /* Empty state */
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg
              width={isHero ? 40 : 28}
              height={isHero ? 40 : 28}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isHero ? "rgba(232,168,48,0.3)" : "rgba(255,255,255,0.15)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: "rgba(245,247,249,0.2)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              No photo
            </span>
          </div>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div
            style={{
              position: "absolute", inset: 0,
              background: "rgba(13,17,23,0.8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                width: 20, height: 20, borderRadius: "50%",
                border: "2px solid rgba(232,168,48,0.2)",
                borderTop: "2px solid #e8a830",
                animation: "spin 0.7s linear infinite",
              }}
            />
          </div>
        )}

        {/* Hero badge */}
        {isHero && (
          <div
            style={{
              position: "absolute", top: 10, left: 10,
              zIndex: 10,
              fontFamily: "monospace", fontSize: 7,
              fontWeight: 800, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#e8a830",
              background: "rgba(232,168,48,0.12)",
              border: "1px solid rgba(232,168,48,0.3)",
              borderRadius: 3, padding: "4px 9px",
            }}
          >
            Featured
          </div>
        )}

        {/* Label overlay */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: isHero ? "40px 16px 14px" : "28px 14px 12px",
            background: "linear-gradient(to top, rgba(13,17,23,0.92) 0%, transparent 100%)",
          }}
        >
          <p
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: isHero ? "1.4rem" : "0.95rem",
              letterSpacing: "0.04em",
              color: "#f5f7f9",
              margin: 0, lineHeight: 1,
            }}
          >
            {photo.label}
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: isHero ? 9 : 8,
              color: "rgba(245,247,249,0.35)",
              letterSpacing: "0.1em",
              margin: "3px 0 0",
            }}
          >
            {photo.caption}
          </p>
        </div>
      </div>

      {/* ── Action bar ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "10px 10px",
          background: "rgba(0,0,0,0.35)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(photo.index, file);
            e.target.value = "";
          }}
        />

        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            flex: 1,
            padding: "7px 0",
            borderRadius: 7,
            background: photo.src
              ? "rgba(232,168,48,0.08)"
              : "rgba(232,168,48,0.12)",
            border: "1px solid rgba(232,168,48,0.25)",
            color: "#e8a830",
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.5 : 1,
          }}
        >
          {photo.src ? "Change" : "+ Upload"}
        </button>

        <button
          onClick={() => onEditMeta(photo.index)}
          title="Edit label & caption"
          style={{
            padding: "7px 10px",
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(245,247,249,0.45)",
            fontFamily: "monospace",
            fontSize: 9,
            cursor: "pointer",
          }}
        >
          ✎
        </button>

        {photo.src && (
          <button
            onClick={() => onRemove(photo.index)}
            disabled={uploading}
            title="Remove photo"
            style={{
              padding: "7px 10px",
              borderRadius: 7,
              background: "rgba(248,113,113,0.06)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171",
              fontFamily: "monospace",
              fontSize: 9,
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.5 : 1,
            }}
          >
            ✕
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MetaEditModal — edit label + caption for a tile
// ─────────────────────────────────────────────────────────────────────────────
function MetaEditModal({
  photo,
  onSave,
  onClose,
}: {
  photo: BentoPhoto;
  onSave: (index: number, label: string, caption: string) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(photo.label);
  const [caption, setCaption] = useState(photo.caption);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 99998,
        }}
      />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(400px, calc(100vw - 48px))",
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18, padding: 28,
          zIndex: 99999,
          display: "flex", flexDirection: "column", gap: 18,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "monospace", fontSize: 8, fontWeight: 800,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(232,168,48,0.6)", margin: "0 0 4px",
            }}
          >
            Edit Tile #{photo.index + 1}
          </p>
          <h3
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "1.5rem", letterSpacing: "0.05em",
              color: "#f0f4f8", margin: 0,
            }}
          >
            Label & Caption
          </h3>
        </div>

        <div>
          <p style={labelStyle}>Label</p>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="First Crew Run · Jun 15"
            style={inputStyle}
          />
        </div>

        <div>
          <p style={labelStyle}>Caption</p>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Koronadal Oval"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            onClick={() => { onSave(photo.index, label, caption); onClose(); }}
            style={confirmBtnStyle}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "monospace", fontSize: 8, fontWeight: 800,
  letterSpacing: "0.22em", textTransform: "uppercase",
  color: "rgba(240,244,248,0.3)", margin: "0 0 8px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
  padding: "10px 12px", color: "#f5f7f9",
  fontFamily: "Poppins, sans-serif", fontSize: 12,
  outline: "none", boxSizing: "border-box",
};
const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: "13px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "rgba(240,244,248,0.4)",
  fontFamily: "monospace", fontSize: 10, fontWeight: 700,
  letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer",
};
const confirmBtnStyle: React.CSSProperties = {
  flex: 2, padding: "13px",
  background: "#e8a830", border: "none",
  borderRadius: 10, color: "#0d1117",
  fontFamily: "monospace", fontSize: 10, fontWeight: 800,
  letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminBentoPage() {
  const [photos, setPhotos] = useState<BentoPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { toast, showToast } = useToast();

  // ── Fetch saved bento data from your API ──────────────────────────────────
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bento-photos");
      const data = await res.json();
      // Merge saved srcs into the default metadata
      const merged: BentoPhoto[] = DEFAULT_BENTO.map((tile) => {
        const saved = data.find((d: any) => d.index === tile.index);
        return {
          ...tile,
          src: saved?.src ?? null,
          label: saved?.label ?? tile.label,
          caption: saved?.caption ?? tile.caption,
        };
      });
      setPhotos(merged);
    } catch {
      // Fallback: just use defaults with no images
      setPhotos(DEFAULT_BENTO.map((t) => ({ ...t, src: null })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  // ── Upload ────────────────────────────────────────────────────────────────
  async function handleUpload(index: number, file: File) {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("index", String(index));

      const res = await fetch("/api/admin/bento-photos/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPhotos((prev) =>
          prev.map((p) => (p.index === index ? { ...p, src: data.url } : p)),
        );
        showToast("Photo uploaded ✓");
      } else {
        showToast("Upload failed: " + (data.error ?? "unknown"), false);
      }
    } catch {
      showToast("Upload failed", false);
    } finally {
      setUploadingIndex(null);
    }
  }

  // ── Remove ────────────────────────────────────────────────────────────────
  async function handleRemove(index: number) {
    setUploadingIndex(index);
    try {
      const res = await fetch("/api/admin/bento-photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      const data = await res.json();
      if (data.success) {
        setPhotos((prev) =>
          prev.map((p) => (p.index === index ? { ...p, src: null } : p)),
        );
        showToast("Photo removed");
      } else {
        showToast("Remove failed: " + (data.error ?? "unknown"), false);
      }
    } catch {
      showToast("Remove failed", false);
    } finally {
      setUploadingIndex(null);
    }
  }

  // ── Save metadata (label / caption) ──────────────────────────────────────
  async function handleSaveMeta(index: number, label: string, caption: string) {
    try {
      const res = await fetch("/api/admin/bento-photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, label, caption }),
      });
      const data = await res.json();
      if (data.success) {
        setPhotos((prev) =>
          prev.map((p) => (p.index === index ? { ...p, label, caption } : p)),
        );
        showToast("Tile updated ✓");
      } else {
        showToast("Update failed: " + (data.error ?? "unknown"), false);
      }
    } catch {
      showToast("Update failed", false);
    }
  }

  const filled = photos.filter((p) => p.src !== null).length;
  const editingPhoto = editingIndex !== null ? photos[editingIndex] : null;

  return (
    <div style={{ padding: "32px 36px 60px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "monospace", fontSize: 9, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(240,244,248,0.28)", margin: "0 0 4px",
              }}
            >
              Shoepreme
            </p>
            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "2.4rem", letterSpacing: "0.04em",
                color: "#f0f4f8", margin: 0,
              }}
            >
              Crew Photos
            </h1>
          </div>
          <ActionButton onClick={() => fetchPhotos()} variant="ghost">
            ↻ Refresh
          </ActionButton>
        </div>

        {/* ── Stat strip ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12, marginBottom: 28,
          }}
        >
          {[
            { label: "Total Tiles", value: "9", sub: "bento grid" },
            { label: "Photos Added", value: String(filled), color: "#e8a830", sub: filled === 9 ? "grid complete 🎉" : `${9 - filled} remaining` },
            { label: "Hero Tile", value: photos[0]?.src ? "✓ Set" : "Empty", color: photos[0]?.src ? "#4ade80" : "#f87171", sub: "tile #1 · featured" },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.018)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "18px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace", fontSize: 8, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(240,244,248,0.28)", margin: "0 0 6px",
                }}
              >
                {c.label}
              </p>
              <p
                style={{
                  fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem",
                  color: c.color ?? "#f0f4f8", margin: "0 0 2px", lineHeight: 1,
                }}
              >
                {c.value}
              </p>
              <p
                style={{
                  fontFamily: "monospace", fontSize: 9,
                  color: "rgba(240,244,248,0.3)", margin: 0,
                }}
              >
                {c.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Info banner ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(232,168,48,0.05)",
            border: "1px solid rgba(232,168,48,0.15)",
            borderRadius: 10,
            padding: "12px 18px",
            marginBottom: 24,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8a830" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p
            style={{
              fontFamily: "monospace", fontSize: 9,
              color: "rgba(245,247,249,0.45)",
              letterSpacing: "0.04em", margin: 0, lineHeight: 1.7,
            }}
          >
            Photos appear on the <strong style={{ color: "rgba(245,247,249,0.65)" }}>Crew Runs</strong> bento grid on the storefront.
            Tile #1 is the large hero tile. Use <strong style={{ color: "rgba(245,247,249,0.65)" }}>✎</strong> to edit the label and caption of any tile.
          </p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          /* ── Bento grid — mirrors the exact desktop layout from the storefront ── */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(3, 220px)",
              gap: 12,
            }}
          >
            {/* Hero: spans 2×2 */}
            <div style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
              <BentoAdminTile
                photo={photos[0]}
                onUpload={handleUpload}
                onRemove={handleRemove}
                onEditMeta={setEditingIndex}
                uploading={uploadingIndex === 0}
              />
            </div>

            <div style={{ gridColumn: "3 / 4", gridRow: "1 / 2" }}>
              <BentoAdminTile photo={photos[1]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 1} />
            </div>
            <div style={{ gridColumn: "4 / 5", gridRow: "1 / 2" }}>
              <BentoAdminTile photo={photos[2]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 2} />
            </div>
            <div style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }}>
              <BentoAdminTile photo={photos[3]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 3} />
            </div>
            <div style={{ gridColumn: "4 / 5", gridRow: "2 / 3" }}>
              <BentoAdminTile photo={photos[4]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 4} />
            </div>
            <div style={{ gridColumn: "1 / 2", gridRow: "3 / 4" }}>
              <BentoAdminTile photo={photos[5]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 5} />
            </div>
            <div style={{ gridColumn: "2 / 3", gridRow: "3 / 4" }}>
              <BentoAdminTile photo={photos[6]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 6} />
            </div>
            <div style={{ gridColumn: "3 / 4", gridRow: "3 / 4" }}>
              <BentoAdminTile photo={photos[7]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 7} />
            </div>
            <div style={{ gridColumn: "4 / 5", gridRow: "3 / 4" }}>
              <BentoAdminTile photo={photos[8]} onUpload={handleUpload} onRemove={handleRemove} onEditMeta={setEditingIndex} uploading={uploadingIndex === 8} />
            </div>
          </div>
        )}

        {/* Tile index legend */}
        {!loading && (
          <p
            style={{
              fontFamily: "monospace", fontSize: 9,
              color: "rgba(245,247,249,0.18)",
              letterSpacing: "0.1em", marginTop: 14, textAlign: "right",
            }}
          >
            Layout mirrors the live storefront · {filled}/9 photos set
          </p>
        )}
      </div>

      <Toast toast={toast} />

      {/* ── Meta edit modal ── */}
      {editingPhoto && (
        <MetaEditModal
          photo={editingPhoto}
          onSave={handleSaveMeta}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
}