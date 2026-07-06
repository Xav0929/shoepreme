"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type EventStatus = "upcoming" | "ongoing" | "past";
type EventCategory = "marathon" | "fun-run" | "meetup" | "drop" | "collab";

interface EventRule {
  title: string;
  body: string;
}

interface CrewEvent {
  id: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  status: EventStatus;
  date: string;          // ISO string
  endDate?: string;      // ISO string — for multi-day events
  time?: string;         // "6:00 AM"
  location: string;      // readable address
  locationShort: string; // "BGC, Taguig"
  lat: number;
  lng: number;
  registrationUrl?: string;
  registrationDeadline?: string; // ISO string
  registrationFee?: string;      // "₱350"
  slots?: number;
  slotsLeft?: number;
  description: string;
  rules?: EventRule[];
  tags?: string[];
  coverColor?: string;   // accent for card top stripe
}

// ─── Mock Data — swap with API fetch ─────────────────────────────────────────
const EVENTS: CrewEvent[] = [
  {
    id: "ev-001",
    title: "Shoepreme Fun Run 2025",
    subtitle: "Run with the crew. Win with the fit.",
    category: "fun-run",
    status: "upcoming",
    date: "2025-08-10T06:00:00",
    time: "6:00 AM",
    location: "Quirino Grandstand, Rizal Park, Manila",
    locationShort: "Rizal Park, Manila",
    lat: 14.5831,
    lng: 120.9794,
    registrationUrl: "https://shoepreme.ph/register/fun-run-2025",
    registrationDeadline: "2025-07-31T23:59:00",
    registrationFee: "₱350",
    slots: 500,
    slotsLeft: 143,
    description:
      "Lace up and join the Shoepreme crew for our annual fun run. 3K, 5K, and 10K categories. Finisher tee, medal, and exclusive colorway drops for participants.",
    rules: [
      { title: "Registration", body: "Online pre-registration only. No walk-in registration on race day." },
      { title: "Race Kit Claiming", body: "August 7–9 at Shoepreme Gensan. Valid ID required. No proxy claiming without authorization letter." },
      { title: "Cut-off Time", body: "3K: 45 mins · 5K: 1.5 hrs · 10K: 2 hrs. Participants beyond cut-off will be pulled from the course." },
      { title: "Prohibited Items", body: "No strollers, pets, skates, or bicycles on the race course." },
      { title: "Bib & Chip", body: "Wear your race bib on the front of your shirt. Timing chip must be attached to your shoe laces." },
    ],
    tags: ["3K", "5K", "10K", "Finisher Tee", "Medal"],
    coverColor: "#e8a830",
  },
  {
    id: "ev-002",
    title: "Crew Night Market Vol. 3",
    subtitle: "Sneakers. Streetwear. Sounds.",
    category: "meetup",
    status: "upcoming",
    date: "2025-07-26T18:00:00",
    endDate: "2025-07-27T00:00:00",
    time: "6:00 PM – 12:00 AM",
    location: "SM City Gensan Activity Center, General Santos City",
    locationShort: "SM Gensan, GenSan",
    lat: 6.1107,
    lng: 125.1716,
    registrationUrl: "https://shoepreme.ph/register/night-market-3",
    registrationFee: "Free Entry",
    description:
      "Third edition of the Crew Night Market. Vendors, raffles, live DJ sets, and an exclusive drop for attendees. Trade, cop, or just flex your grail — all are welcome.",
    rules: [
      { title: "Vendor Slots", body: "Apply via the vendor form on our website. Deadline July 20. Tables are first-come-first-served after approval." },
      { title: "Trade Guidelines", body: "All trades are between individuals. Shoepreme is not liable for private transactions. Always authenticate before you trade." },
      { title: "Dress Code", body: "None — but the freshest fit might win the best-dressed raffle." },
    ],
    tags: ["Free Entry", "Live DJ", "Raffle", "Vendors"],
    coverColor: "#4a7fa5",
  },
  {
    id: "ev-003",
    title: "Sole Marathon GenSan 2025",
    subtitle: "42K through the streets of South.",
    category: "marathon",
    status: "upcoming",
    date: "2025-09-21T04:00:00",
    time: "4:00 AM gun start",
    location: "Oval Plaza, General Santos City",
    locationShort: "Oval Plaza, GenSan",
    lat: 6.1098,
    lng: 125.1722,
    registrationUrl: "https://shoepreme.ph/register/sole-marathon-2025",
    registrationDeadline: "2025-09-07T23:59:00",
    registrationFee: "₱750",
    slots: 1000,
    slotsLeft: 312,
    description:
      "The biggest Shoepreme-backed road race to date. Full 42K, Half 21K, and 10K distances. Certified route, chip timing, finisher medal, and exclusive marathon colorway for full-marathon finishers.",
    rules: [
      { title: "Distances", body: "42K Full Marathon · 21K Half Marathon · 10K Road Race. Age minimum: 18 for 42K, 15 for 21K, 12 for 10K (with guardian consent)." },
      { title: "Medical Clearance", body: "42K participants must submit a medical certificate from a licensed physician at kit claiming." },
      { title: "Cut-off Times", body: "42K: 6 hrs · 21K: 3.5 hrs · 10K: 2 hrs. Course will reopen to traffic after cut-off." },
      { title: "Pace Requirement", body: "Minimum pace: 8:30 min/km for 42K. Participants failing to maintain pace will be redirected to a shorter route." },
      { title: "Hydration Stations", body: "Water and electrolyte stations every 3 km. Personal hydration packs allowed." },
      { title: "Photography", body: "Professional race photographers on course. Photos available 3 days post-race on our website." },
    ],
    tags: ["42K", "21K", "10K", "Chip Timing", "Certified Route"],
    coverColor: "#f87171",
  },
  {
    id: "ev-004",
    title: "Shoepreme x Local Breed Collab Drop",
    subtitle: "Limited. Announced here first.",
    category: "collab",
    status: "ongoing",
    date: "2025-07-05T10:00:00",
    endDate: "2025-07-20T23:59:00",
    time: "Online drop — 10:00 AM",
    location: "Shoepreme Store + Online",
    locationShort: "GenSan + Online",
    lat: 6.1098,
    lng: 125.172,
    description:
      "Shoepreme x Local Breed limited collab drop. Two colorways, 100 pairs each. In-store raffle for walk-in releases plus online cart opens simultaneously.",
    rules: [
      { title: "Raffle", body: "In-store raffle entries accepted July 5–7. One entry per valid ID. Winners notified July 8 via text." },
      { title: "Online Drop", body: "Online cart opens July 5, 10:00 AM sharp. Limit one pair per account. Cart reservations expire after 10 minutes." },
      { title: "Payment", body: "Full payment required within 24 hrs of winning. Unclaimed raffle wins will roll over to the next buyer on the waitlist." },
    ],
    tags: ["Limited", "Collab", "Raffle", "Online Drop"],
    coverColor: "#a78bfa",
  },
  {
    id: "ev-005",
    title: "Crew Run: Koronadal City Loop",
    subtitle: "15K casual group run.",
    category: "fun-run",
    status: "past",
    date: "2025-06-01T05:30:00",
    time: "5:30 AM",
    location: "Marbel Public Plaza, Koronadal City",
    locationShort: "Marbel Plaza, Koronadal",
    lat: 6.5027,
    lng: 124.8474,
    description:
      "Monthly crew run through the Koronadal loop. Casual pace, no race clock — just vibes, kicks, and post-run breakfast.",
    tags: ["15K", "Casual", "Monthly"],
    coverColor: "rgba(245,247,249,0.1)",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<EventCategory, string> = {
  marathon: "Marathon",
  "fun-run": "Fun Run",
  meetup: "Meetup",
  drop: "Drop Event",
  collab: "Collab Drop",
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  marathon: "#f87171",
  "fun-run": "#4ade80",
  meetup: "#4a7fa5",
  drop: "#e8a830",
  collab: "#a78bfa",
};

const STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Live Now",
  past: "Past",
};

const STATUS_COLORS: Record<EventStatus, string> = {
  upcoming: "#e8a830",
  ongoing: "#4ade80",
  past: "rgba(245,247,249,0.25)",
};

function formatEventDate(iso: string, long = false) {
  return new Date(iso).toLocaleDateString("en-PH", {
    weekday: long ? "long" : "short",
    year: "numeric",
    month: long ? "long" : "short",
    day: "numeric",
  });
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days away`;
}

function slotsPercent(left: number, total: number) {
  return Math.round(((total - left) / total) * 100);
}

// ─── Tab Filter ───────────────────────────────────────────────────────────────
const TABS: { key: EventStatus | "all"; label: string }[] = [
  { key: "all", label: "All Events" },
  { key: "ongoing", label: "Live Now" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

// ─── Map Preview ──────────────────────────────────────────────────────────────
function EventMapPreview({ event }: { event: CrewEvent }) {
  const span = 0.015;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${event.lng - span},${event.lat - span},${event.lng + span},${event.lat + span}&layer=mapnik&marker=${event.lat},${event.lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <iframe
        src={src}
        width="100%"
        height="180"
        style={{
          border: 0,
          display: "block",
          filter: "brightness(0.65) saturate(0.7)",
          pointerEvents: "none",
        }}
        loading="lazy"
        title={`Map: ${event.locationShort}`}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "linear-gradient(to top, rgba(13,17,23,0.95), transparent)",
          pointerEvents: "none",
        }}
      />
      {/* Pin */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -65%)",
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "relative", width: "28px", height: "28px" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `${event.coverColor ?? "#e8a830"}30`,
              animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "5px",
              borderRadius: "50%",
              background: event.coverColor ?? "#e8a830",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#0d1117">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" fill="#0d1117" />
            </svg>
          </div>
        </div>
      </div>
      {/* Location label bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "10px",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245,247,249,0.5)",
            margin: 0,
          }}
        >
          {event.locationShort}
        </p>
      </div>
      {/* Open maps pill bottom-right */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          bottom: "8px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "rgba(13,17,23,0.85)",
          border: `1px solid ${event.coverColor ?? "#e8a830"}50`,
          borderRadius: "20px",
          padding: "3px 8px",
          textDecoration: "none",
          zIndex: 2,
        }}
      >
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={event.coverColor ?? "#e8a830"} strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "7px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: event.coverColor ?? "#e8a830",
          }}
        >
          Open Maps
        </span>
      </a>
      <style>{`@keyframes ping { 75%, 100% { transform: scale(1.9); opacity: 0; } }`}</style>
    </div>
  );
}

// ─── Rules Accordion ──────────────────────────────────────────────────────────
function RulesAccordion({ rules, accentColor }: { rules: EventRule[]; accentColor: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          background: `${accentColor}08`,
          border: `1px solid ${accentColor}25`,
          borderRadius: open ? "10px 10px 0 0" : "10px",
          padding: "12px 16px",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            Rules & Guidelines
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              color: `${accentColor}80`,
              background: `${accentColor}15`,
              borderRadius: "10px",
              padding: "1px 7px",
            }}
          >
            {rules.length}
          </span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            border: `1px solid ${accentColor}20`,
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            overflow: "hidden",
          }}
        >
          {rules.map((rule, i) => (
            <div key={i} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "12px 16px",
                  background: expanded === i ? "rgba(255,255,255,0.03)" : "rgba(13,17,23,0.6)",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "5px",
                      background: `${accentColor}15`,
                      border: `1px solid ${accentColor}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "monospace",
                      fontSize: "8px",
                      fontWeight: 800,
                      color: accentColor,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: "rgba(245,247,249,0.7)",
                    }}
                  >
                    {rule.title}
                  </span>
                </div>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(245,247,249,0.25)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ transform: expanded === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {expanded === i && (
                <div style={{ padding: "0 16px 14px 44px" }}>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.45)",
                      letterSpacing: "0.04em",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {rule.body}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event }: { event: CrewEvent }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[event.category];
  const statusColor = STATUS_COLORS[event.status];
  const countdown = daysUntil(event.date);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = `${event.coverColor ?? catColor}30`)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)")}
    >
      {/* Top color stripe */}
      <div
        style={{
          height: "3px",
          background: event.status === "past"
            ? "rgba(255,255,255,0.06)"
            : `linear-gradient(90deg, ${event.coverColor ?? catColor}, ${event.coverColor ?? catColor}40)`,
        }}
      />

      <div style={{ padding: "20px 22px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badges */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "monospace",
                  fontSize: "8px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: catColor,
                  background: `${catColor}15`,
                  border: `1px solid ${catColor}35`,
                  borderRadius: "5px",
                  padding: "2px 8px",
                  whiteSpace: "nowrap",
                }}
              >
                {CATEGORY_LABELS[event.category]}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "monospace",
                  fontSize: "8px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: statusColor,
                  background: `${statusColor}15`,
                  border: `1px solid ${statusColor}35`,
                  borderRadius: "5px",
                  padding: "2px 8px",
                  whiteSpace: "nowrap",
                }}
              >
                {event.status === "ongoing" && (
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: statusColor,
                      animation: "ping 1.5s ease-in-out infinite",
                    }}
                  />
                )}
                {STATUS_LABELS[event.status]}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "1.5rem",
                letterSpacing: "0.05em",
                color: event.status === "past" ? "rgba(245,247,249,0.4)" : "#f5f7f9",
                margin: "0 0 3px",
                lineHeight: 1,
              }}
            >
              {event.title}
            </h2>
            {event.subtitle && (
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "rgba(245,247,249,0.35)",
                  letterSpacing: "0.04em",
                  margin: 0,
                }}
              >
                {event.subtitle}
              </p>
            )}
          </div>

          {/* Countdown pill */}
          {countdown && event.status !== "past" && (
            <div
              style={{
                flexShrink: 0,
                background: `${event.coverColor ?? catColor}10`,
                border: `1px solid ${event.coverColor ?? catColor}30`,
                borderRadius: "8px",
                padding: "6px 12px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.06em",
                  color: event.coverColor ?? catColor,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {countdown}
              </p>
            </div>
          )}
        </div>

        {/* Date / Time / Location meta */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          {[
            {
              icon: (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
              label: "Date",
              value: formatEventDate(event.date, false),
            },
            {
              icon: (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              label: "Time",
              value: event.time ?? "TBA",
            },
            {
              icon: (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              ),
              label: "Location",
              value: event.locationShort,
            },
            {
              icon: (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              ),
              label: "Entry Fee",
              value: event.registrationFee ?? "Free",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ marginTop: "1px", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "7px",
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(245,247,249,0.25)",
                    margin: "0 0 2px",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(245,247,249,0.7)",
                    letterSpacing: "0.04em",
                    margin: 0,
                  }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "16px" }}>
            {event.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(245,247,249,0.35)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "4px",
                  padding: "2px 7px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Slots bar */}
        {event.slots && event.slotsLeft !== undefined && event.status !== "past" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,247,249,0.3)" }}>
                Registration Slots
              </span>
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: catColor, fontWeight: 700 }}>
                {event.slotsLeft} left / {event.slots}
              </span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${slotsPercent(event.slotsLeft, event.slots)}%`,
                  background: event.slotsLeft < event.slots * 0.2 ? "#f87171" : catColor,
                  borderRadius: "2px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Registration deadline */}
        {event.registrationDeadline && event.status !== "past" && (
          <div
            style={{
              background: "rgba(248,113,113,0.04)",
              border: "1px solid rgba(248,113,113,0.12)",
              borderRadius: "8px",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(248,113,113,0.7)", letterSpacing: "0.04em", margin: 0 }}>
              Registration closes {formatEventDate(event.registrationDeadline, false)}
            </p>
          </div>
        )}

        {/* Toggle details */}
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 0 14px",
            color: "rgba(245,247,249,0.3)",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {expanded ? "Less Info" : "More Info"}
          </span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {expanded && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingTop: "4px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Description */}
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "rgba(245,247,249,0.5)",
                letterSpacing: "0.04em",
                lineHeight: 1.8,
                margin: "14px 0 0",
              }}
            >
              {event.description}
            </p>

            {/* Full address */}
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round" style={{ marginTop: "2px", flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,247,249,0.25)", margin: "0 0 3px" }}>Full Address</p>
                <p style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(245,247,249,0.55)", letterSpacing: "0.03em", margin: 0, lineHeight: 1.5 }}>{event.location}</p>
              </div>
            </div>

            {/* Map */}
            <EventMapPreview event={event} />

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
              <RulesAccordion rules={event.rules} accentColor={event.coverColor ?? catColor} />
            )}
          </div>
        )}

        {/* CTA */}
        {event.registrationUrl && event.status !== "past" ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "14px",
              background: event.status === "ongoing" ? catColor : `${catColor}12`,
              border: `1px solid ${catColor}${event.status === "ongoing" ? "" : "35"}`,
              borderRadius: "10px",
              color: event.status === "ongoing" ? "#0d1117" : catColor,
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxSizing: "border-box",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            {event.status === "ongoing" ? "Join Now →" : "Register Now →"}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        ) : event.status === "past" ? (
          <div
            style={{
              width: "100%",
              padding: "13px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245,247,249,0.2)",
            }}
          >
            Event Ended
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TheCrewPage() {
  const [activeTab, setActiveTab] = useState<EventStatus | "all">("all");
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");

  const filtered = EVENTS.filter((e) => {
    const tabMatch = activeTab === "all" || e.status === activeTab;
    const catMatch = activeCategory === "all" || e.category === activeCategory;
    return tabMatch && catMatch;
  });

  const ongoingCount = EVENTS.filter((e) => e.status === "ongoing").length;

  const categories = Array.from(new Set(EVENTS.map((e) => e.category))) as EventCategory[];

  return (
    <>
      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(1.9); opacity: 0; } }
        .crew-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 20px; }
        @media (max-width: 600px) { .crew-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1117" }}>
        {/* ── Hero ── */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "64px 32px 48px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(245,247,249,0.25)",
              margin: "0 0 8px",
            }}
          >
            Shoepreme Community
          </p>
          <h1
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              letterSpacing: "0.04em",
              color: "#f5f7f9",
              margin: "0 0 12px",
              lineHeight: 0.9,
            }}
          >
            The Crew
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "rgba(245,247,249,0.4)",
              letterSpacing: "0.06em",
              margin: "0 0 28px",
              maxWidth: "480px",
              lineHeight: 1.7,
            }}
          >
            Runs. Drops. Meetups. Everything happening in the Shoepreme community — dates, locations, registration, and what you need to know.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { label: "Total Events", value: EVENTS.length },
              { label: "Upcoming", value: EVENTS.filter((e) => e.status === "upcoming").length },
              { label: "Live Now", value: ongoingCount, highlight: true },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "2rem",
                    letterSpacing: "0.06em",
                    color: stat.highlight ? "#4ade80" : "#e8a830",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "8px",
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(245,247,249,0.3)",
                    margin: 0,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filters ── */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "24px 32px 0",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Status tabs */}
          <div
            style={{
              display: "flex",
              gap: "0",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexWrap: "wrap",
            }}
          >
            {TABS.map((tab) => {
              const count = tab.key === "all" ? EVENTS.length : EVENTS.filter((e) => e.status === tab.key).length;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    border: "none",
                    borderBottom: isActive ? "2px solid #e8a830" : "2px solid transparent",
                    marginBottom: "-1px",
                    background: "transparent",
                    color: isActive ? "#e8a830" : "rgba(245,247,249,0.35)",
                    fontFamily: "monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s",
                  }}
                >
                  {tab.key === "ongoing" && ongoingCount > 0 && (
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#4ade80",
                        animation: "ping 1.5s ease-in-out infinite",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {tab.label}
                  {count > 0 && (
                    <span
                      style={{
                        background: isActive ? "rgba(232,168,48,0.15)" : "rgba(255,255,255,0.05)",
                        color: isActive ? "#e8a830" : "rgba(245,247,249,0.25)",
                        borderRadius: "20px",
                        padding: "1px 7px",
                        fontSize: "8px",
                        fontWeight: 800,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", paddingBottom: "8px" }}>
            <button
              onClick={() => setActiveCategory("all")}
              style={{
                padding: "5px 14px",
                borderRadius: "20px",
                border: activeCategory === "all" ? "1px solid rgba(232,168,48,0.5)" : "1px solid rgba(255,255,255,0.08)",
                background: activeCategory === "all" ? "rgba(232,168,48,0.1)" : "transparent",
                color: activeCategory === "all" ? "#e8a830" : "rgba(245,247,249,0.35)",
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              All Types
            </button>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const color = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "20px",
                    border: isActive ? `1px solid ${color}50` : "1px solid rgba(255,255,255,0.08)",
                    background: isActive ? `${color}10` : "transparent",
                    color: isActive ? color : "rgba(245,247,249,0.35)",
                    fontFamily: "monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Events Grid ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 32px 80px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "72px 24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "2rem",
                  letterSpacing: "0.08em",
                  color: "rgba(245,247,249,0.1)",
                  margin: "0 0 8px",
                }}
              >
                No Events Found
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "rgba(245,247,249,0.2)",
                  letterSpacing: "0.06em",
                  margin: 0,
                }}
              >
                Try a different filter.
              </p>
            </div>
          ) : (
            <div className="crew-grid">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}