"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Mock Data (same as OrderHistoryClient) ───────────────────────────────────
const MOCK_ORDERS = [
  {
    id: "gid://shopify/Order/1001",
    orderNumber: 1001,
    processedAt: "2025-05-12T10:30:00Z",
    financialStatus: "PAID",
    fulfillmentStatus: "FULFILLED",
    currentTotalPrice: { amount: "8950.00", currencyCode: "PHP" },
    subtotalPrice: { amount: "8500.00", currencyCode: "PHP" },
    totalShippingPrice: { amount: "450.00", currencyCode: "PHP" },
    shippingAddress: {
      firstName: "Marc",
      lastName: "Yuri",
      address1: "123 Rizal St.",
      address2: "Brgy. Poblacion",
      city: "Koronadal",
      province: "South Cotabato",
      zip: "9506",
      country: "Philippines",
      phone: "+639123456789",
    },
    lineItems: {
      edges: [
        {
          node: {
            title: "Nike Air Jordan 1 Retro High OG",
            quantity: 1,
            variant: {
              image: {
                url: "https://placehold.co/120x120/1a2332/4a7fa5?text=AJ1",
                altText: null,
              },
              selectedOptions: [
                { name: "Size", value: "US 10" },
                { name: "Color", value: "Chicago" },
              ],
              price: { amount: "7500.00", currencyCode: "PHP" },
            },
          },
        },
        {
          node: {
            title: "Nike Dunk Low Retro",
            quantity: 1,
            variant: {
              image: {
                url: "https://placehold.co/120x120/1a2332/4a7fa5?text=DUNK",
                altText: null,
              },
              selectedOptions: [
                { name: "Size", value: "US 10" },
                { name: "Color", value: "Panda" },
              ],
              price: { amount: "1000.00", currencyCode: "PHP" },
            },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Order/1002",
    orderNumber: 1002,
    processedAt: "2025-06-01T14:20:00Z",
    financialStatus: "PENDING",
    fulfillmentStatus: "UNFULFILLED",
    currentTotalPrice: { amount: "12500.00", currencyCode: "PHP" },
    subtotalPrice: { amount: "12050.00", currencyCode: "PHP" },
    totalShippingPrice: { amount: "450.00", currencyCode: "PHP" },
    shippingAddress: {
      firstName: "Marc",
      lastName: "Yuri",
      address1: "456 Mabini Ave.",
      address2: null,
      city: "General Santos",
      province: "South Cotabato",
      zip: "9500",
      country: "Philippines",
      phone: "+639123456789",
    },
    lineItems: {
      edges: [
        {
          node: {
            title: "Adidas Yeezy Boost 350 V2",
            quantity: 1,
            variant: {
              image: {
                url: "https://placehold.co/120x120/1a2332/e8a830?text=YEEZY",
                altText: null,
              },
              selectedOptions: [
                { name: "Size", value: "US 9.5" },
                { name: "Color", value: "Zebra" },
              ],
              price: { amount: "12050.00", currencyCode: "PHP" },
            },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Order/1003",
    orderNumber: 1003,
    processedAt: "2025-06-20T09:00:00Z",
    financialStatus: "REFUNDED",
    fulfillmentStatus: "UNFULFILLED",
    currentTotalPrice: { amount: "0.00", currencyCode: "PHP" },
    subtotalPrice: { amount: "5500.00", currencyCode: "PHP" },
    totalShippingPrice: { amount: "450.00", currencyCode: "PHP" },
    shippingAddress: {
      firstName: "Marc",
      lastName: "Yuri",
      address1: "789 Del Pilar St.",
      address2: null,
      city: "Koronadal",
      province: "South Cotabato",
      zip: "9506",
      country: "Philippines",
      phone: "+639123456789",
    },
    lineItems: {
      edges: [
        {
          node: {
            title: "New Balance 550",
            quantity: 1,
            variant: {
              image: {
                url: "https://placehold.co/120x120/1a2332/4a7fa5?text=NB550",
                altText: null,
              },
              selectedOptions: [
                { name: "Size", value: "US 11" },
                { name: "Color", value: "White/Green" },
              ],
              price: { amount: "5500.00", currencyCode: "PHP" },
            },
          },
        },
      ],
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  PAID: "#4ade80",
  PENDING: "#e8a830",
  REFUNDED: "#f87171",
  FULFILLED: "#4a7fa5",
  UNFULFILLED: "rgba(245,247,249,0.4)",
  PARTIALLY_FULFILLED: "#e8a830",
  IN_PROGRESS: "#e8a830",
};

function statusColor(label: string) {
  return STATUS_COLORS[label?.toUpperCase()] ?? "rgba(245,247,249,0.4)";
}

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusBadge({ label }: { label: string }) {
  const c = statusColor(label);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontFamily: "monospace",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: c,
        background: `${c}18`,
        border: `1px solid ${c}40`,
        borderRadius: "6px",
        padding: "3px 8px",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: c,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id as string;
  let decodedId = "";
  try {
    decodedId = atob(decodeURIComponent(rawId));
  } catch {
    decodedId = rawId;
  }

  const order = MOCK_ORDERS.find((o) => o.id === decodedId);
  const items = order?.lineItems.edges.map((e) => e.node) ?? [];
  const addr = order?.shippingAddress;

  if (!order) {
    return (
      <main style={{ minHeight: "100vh", background: "#0d1117" }}>
        <Navbar />
        <section
          style={{
            padding: "clamp(120px, 15vw, 160px) 24px 80px",
            maxWidth: "720px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "2rem",
              color: "rgba(245,247,249,0.15)",
              letterSpacing: "0.08em",
            }}
          >
            Order not found.
          </p>
          <button
            onClick={() => router.push("/account")}
            style={{
              marginTop: "24px",
              padding: "12px 28px",
              background: "#e8a830",
              border: "none",
              borderRadius: "8px",
              color: "#0d1117",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Back to Account
          </button>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0d1117" }}>
      <Navbar />

      {/* Top glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "400px",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,168,48,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          margin: "0 auto",
          padding: "clamp(120px, 15vw, 160px) 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => router.push("/account")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "rgba(245,247,249,0.35)",
            fontFamily: "monospace",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: 0,
            width: "fit-content",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Account
        </button>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(245,247,249,0.3)",
                margin: "0 0 6px",
              }}
            >
              Order Details
            </p>
            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(2rem, 6vw, 3rem)",
                letterSpacing: "0.04em",
                color: "#f5f7f9",
                margin: 0,
                lineHeight: 0.95,
              }}
            >
              #{order.orderNumber}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <StatusBadge label={order.financialStatus} />
            <StatusBadge label={order.fulfillmentStatus} />
          </div>
        </div>

        {/* Meta row */}
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "rgba(245,247,249,0.3)",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          Placed on {formatDate(order.processedAt)}
        </p>

        {/* Items */}
        <div>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(245,247,249,0.3)",
              margin: "0 0 14px",
            }}
          >
            Items ({items.length})
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "rgba(74,127,165,0.1)",
                    border: "1px solid rgba(74,127,165,0.2)",
                  }}
                >
                  {item.variant?.image?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.variant.image.url}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(74,127,165,0.5)"
                        strokeWidth="1.5"
                      >
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#f5f7f9",
                      margin: "0 0 5px",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.4)",
                      margin: "0 0 4px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.variant?.selectedOptions
                      ?.map((o) => o.value)
                      .join(" · ")}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      color: "rgba(245,247,249,0.25)",
                      margin: 0,
                    }}
                  >
                    Qty: {item.quantity}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "1.1rem",
                    letterSpacing: "0.06em",
                    color: "#e8a830",
                    margin: 0,
                    flexShrink: 0,
                  }}
                >
                  {item.variant?.price
                    ? formatPrice(
                        (
                          parseFloat(item.variant.price.amount) * item.quantity
                        ).toString(),
                        item.variant.price.currencyCode,
                      )
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom grid: address + summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Shipping address */}
          {addr && (
            <div>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(245,247,249,0.3)",
                  margin: "0 0 14px",
                }}
              >
                Shipping Address
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(232,168,48,0.6)"
                  strokeWidth="2"
                  style={{ marginTop: "2px", flexShrink: 0 }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#f5f7f9",
                      margin: "0 0 6px",
                    }}
                  >
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.4)",
                      margin: "0 0 3px",
                      letterSpacing: "0.03em",
                      lineHeight: 1.5,
                    }}
                  >
                    {addr.address1}
                    {addr.address2 ? `, ${addr.address2}` : ""}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.4)",
                      margin: "0 0 3px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {addr.city}, {addr.province} {addr.zip}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.4)",
                      margin: "0 0 3px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {addr.country}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.3)",
                      margin: 0,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {addr.phone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(245,247,249,0.3)",
                margin: "0 0 14px",
              }}
            >
              Summary
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                { label: "Subtotal", value: order.subtotalPrice },
                { label: "Shipping", value: order.totalShippingPrice },
              ].map(({ label, value }) =>
                value ? (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "10px",
                        color: "rgba(245,247,249,0.35)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "rgba(245,247,249,0.6)",
                      }}
                    >
                      {formatPrice(value.amount, value.currencyCode)}
                    </span>
                  </div>
                ) : null,
              )}
              <div
                style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(245,247,249,0.5)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "1.5rem",
                    letterSpacing: "0.06em",
                    color: "#e8a830",
                  }}
                >
                  {formatPrice(
                    order.currentTotalPrice.amount,
                    order.currentTotalPrice.currencyCode,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Track order CTA */}
        <button
          style={{
            width: "100%",
            padding: "16px",
            background: "rgba(232,168,48,0.08)",
            border: "1px solid rgba(232,168,48,0.25)",
            borderRadius: "12px",
            color: "#e8a830",
            fontFamily: "monospace",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Track Order →
        </button>
      </section>

      <Footer />
    </main>
  );
}
