"use client";

import Link from "next/link";

// ─── Mock Data ────────────────────────────────────────────────────────────────
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

function color(label: string) {
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
    month: "short",
    day: "numeric",
  });
}

function encodeOrderId(id: string) {
  return encodeURIComponent(btoa(id));
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ label }: { label: string }) {
  const c = color(label);
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

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function OrderHistoryClient() {
  const orders = MOCK_ORDERS;

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "1.4rem",
            letterSpacing: "0.08em",
            color: "#f5f7f9",
            margin: 0,
          }}
        >
          Order History
        </h2>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            color: "rgba(245,247,249,0.3)",
            letterSpacing: "0.1em",
          }}
        >
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Order list */}
      {orders.length === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "1.6rem",
              letterSpacing: "0.08em",
              color: "rgba(245,247,249,0.15)",
              margin: "0 0 8px",
            }}
          >
            No orders yet.
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(245,247,249,0.25)",
              letterSpacing: "0.08em",
              margin: 0,
            }}
          >
            Your order history will appear here once you make a purchase.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {orders.map((order) => {
            const items = order.lineItems.edges.map((e) => e.node);
            const firstImage = items[0]?.variant?.image?.url;
            return (
              <Link
                key={order.id}
                href={`/account/orders/${encodeOrderId(order.id)}`}
                style={{
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(232,168,48,0.3)";
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(232,168,48,0.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(255,255,255,0.02)";
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "10px",
                    background: "rgba(74,127,165,0.1)",
                    border: "1px solid rgba(74,127,165,0.2)",
                    flexShrink: 0,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {firstImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={firstImage}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(74,127,165,0.5)"
                      strokeWidth="1.5"
                    >
                      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                      rowGap: "4px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1rem",
                        letterSpacing: "0.08em",
                        color: "#f5f7f9",
                      }}
                    >
                      Order #{order.orderNumber}
                    </span>
                    <StatusBadge label={order.financialStatus} />
                    <StatusBadge label={order.fulfillmentStatus} />
                  </div>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.35)",
                      letterSpacing: "0.06em",
                      margin: "0 0 4px",
                    }}
                  >
                    {formatDate(order.processedAt)} · {items.length} item
                    {items.length !== 1 ? "s" : ""}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.5)",
                      letterSpacing: "0.04em",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "320px",
                    }}
                  >
                    {items
                      .slice(0, 2)
                      .map((i) => i.title)
                      .join(", ")}
                    {items.length > 2 && ` +${items.length - 2} more`}
                  </p>
                </div>

                {/* Total + chevron */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                    marginLeft: "auto",
                    paddingTop: "2px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "1.3rem",
                      letterSpacing: "0.06em",
                      color: "#e8a830",
                      margin: 0,
                    }}
                  >
                    {formatPrice(
                      order.currentTotalPrice.amount,
                      order.currentTotalPrice.currencyCode,
                    )}
                  </p>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(245,247,249,0.25)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
