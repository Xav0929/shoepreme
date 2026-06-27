"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ADDRESSES = [
  {
    id: "addr_1",
    firstName: "Marc",
    lastName: "Yuri",
    address1: "123 Rizal St.",
    address2: "Brgy. Poblacion",
    city: "Koronadal",
    province: "South Cotabato",
    zip: "9506",
    country: "Philippines",
    phone: "+639123456789",
    isDefault: true,
  },
  {
    id: "addr_2",
    firstName: "Marc",
    lastName: "Yuri",
    address1: "456 Mabini Ave.",
    address2: "",
    city: "General Santos",
    province: "South Cotabato",
    zip: "9500",
    country: "Philippines",
    phone: "+639123456789",
    isDefault: false,
  },
];

type Address = (typeof MOCK_ADDRESSES)[number];

// ─── Address Form Modal ───────────────────────────────────────────────────────
function AddressFormModal({
  address,
  onClose,
  onSave,
}: {
  address: Address | null;
  onClose: () => void;
  onSave: (data: Omit<Address, "id" | "isDefault">) => void;
}) {
  const [form, setForm] = useState({
    firstName: address?.firstName ?? "",
    lastName: address?.lastName ?? "",
    address1: address?.address1 ?? "",
    address2: address?.address2 ?? "",
    city: address?.city ?? "",
    province: address?.province ?? "",
    zip: address?.zip ?? "",
    country: address?.country ?? "Philippines",
    phone: address?.phone ?? "",
  });

  const isEditing = !!address;

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f5f7f9",
    fontFamily: "monospace",
    fontSize: "11px",
    letterSpacing: "0.04em",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontFamily: "monospace",
    fontSize: "8px",
    fontWeight: 800,
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    color: "rgba(245,247,249,0.3)",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          zIndex: 99998,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          background: "#0d1117",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
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
                margin: "0 0 4px",
              }}
            >
              {isEditing ? "Edit Address" : "New Address"}
            </p>
            <h2
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "1.8rem",
                letterSpacing: "0.06em",
                color: "#f5f7f9",
                margin: 0,
              }}
            >
              {isEditing ? "Update Details" : "Add Address"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(245,247,249,0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Name row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                style={inputStyle}
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                placeholder="Marc"
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                style={inputStyle}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Yuri"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Address Line 1</label>
            <input
              style={inputStyle}
              value={form.address1}
              onChange={(e) => setForm({ ...form, address1: e.target.value })}
              placeholder="123 Rizal St."
            />
          </div>

          <div>
            <label style={labelStyle}>Address Line 2 (optional)</label>
            <input
              style={inputStyle}
              value={form.address2}
              onChange={(e) => setForm({ ...form, address2: e.target.value })}
              placeholder="Brgy. Poblacion"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle}>City</label>
              <input
                style={inputStyle}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Koronadal"
              />
            </div>
            <div>
              <label style={labelStyle}>Province</label>
              <input
                style={inputStyle}
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                placeholder="South Cotabato"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle}>ZIP Code</label>
              <input
                style={inputStyle}
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                placeholder="9506"
              />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input
                style={inputStyle}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="Philippines"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Phone</label>
            <input
              style={inputStyle}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+639123456789"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 28px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "13px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              color: "rgba(245,247,249,0.4)",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            style={{
              flex: 2,
              padding: "13px",
              background: "#e8a830",
              border: "none",
              borderRadius: "10px",
              color: "#0d1117",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {isEditing ? "Save Changes" : "Add Address"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          zIndex: 99998,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(360px, calc(100vw - 48px))",
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "28px",
          zIndex: 99999,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "1.4rem",
            letterSpacing: "0.06em",
            color: "#f5f7f9",
            margin: "0 0 8px",
          }}
        >
          Remove Address?
        </h3>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "rgba(245,247,249,0.4)",
            letterSpacing: "0.04em",
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          This address will be permanently removed from your account.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "rgba(245,247,249,0.4)",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "8px",
              color: "#f87171",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function SavedAddressesClient() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [editingAddress, setEditingAddress] = useState<
    Address | null | undefined
  >(undefined); // undefined = closed, null = new
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSave(data: Omit<Address, "id" | "isDefault">) {
    if (editingAddress === null) {
      // Add new
      setAddresses((prev) => [
        ...prev,
        { ...data, id: `addr_${Date.now()}`, isDefault: prev.length === 0 },
      ]);
    } else if (editingAddress) {
      // Update existing
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? { ...a, ...data } : a)),
      );
    }
  }

  function handleDelete(id: string) {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // If deleted was default, make first one default
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  }

  function handleSetDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

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
          Saved Addresses
        </h2>
        <button
          onClick={() => setEditingAddress(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(232,168,48,0.08)",
            border: "1px solid rgba(232,168,48,0.2)",
            borderRadius: "8px",
            padding: "7px 14px",
            color: "#e8a830",
            fontFamily: "monospace",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New
        </button>
      </div>

      {/* Address cards */}
      {addresses.length === 0 ? (
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
            No addresses saved.
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(245,247,249,0.25)",
              letterSpacing: "0.08em",
              margin: "0 0 20px",
            }}
          >
            Add an address to speed up your checkout.
          </p>
          <button
            onClick={() => setEditingAddress(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#e8a830",
              color: "#0d1117",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add Address
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${addr.isDefault ? "rgba(232,168,48,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "14px",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                position: "relative",
              }}
            >
              {/* Default badge */}
              {addr.isDefault && (
                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    fontFamily: "monospace",
                    fontSize: "8px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#e8a830",
                    background: "rgba(232,168,48,0.1)",
                    border: "1px solid rgba(232,168,48,0.25)",
                    borderRadius: "4px",
                    padding: "2px 7px",
                  }}
                >
                  Default
                </span>
              )}

              {/* Address info */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(74,127,165,0.1)",
                    border: "1px solid rgba(74,127,165,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4a7fa5"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#f5f7f9",
                      margin: "0 0 4px",
                      paddingRight: addr.isDefault ? "60px" : "0",
                    }}
                  >
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(245,247,249,0.4)",
                      margin: "0 0 2px",
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
                      margin: "0 0 2px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {addr.city}, {addr.province} {addr.zip}
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

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: "12px",
                }}
              >
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "7px",
                      color: "rgba(245,247,249,0.35)",
                      fontFamily: "monospace",
                      fontSize: "8px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => setEditingAddress(addr)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "rgba(74,127,165,0.08)",
                    border: "1px solid rgba(74,127,165,0.2)",
                    borderRadius: "7px",
                    color: "#4a7fa5",
                    fontFamily: "monospace",
                    fontSize: "8px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => setDeletingId(addr.id)}
                    style={{
                      width: "34px",
                      padding: "8px",
                      background: "rgba(248,113,113,0.06)",
                      border: "1px solid rgba(248,113,113,0.15)",
                      borderRadius: "7px",
                      color: "#f87171",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Portals */}
      {mounted &&
        editingAddress !== undefined &&
        createPortal(
          <AddressFormModal
            address={editingAddress}
            onClose={() => setEditingAddress(undefined)}
            onSave={handleSave}
          />,
          document.body,
        )}

      {mounted &&
        deletingId &&
        createPortal(
          <DeleteConfirmModal
            onClose={() => setDeletingId(null)}
            onConfirm={() => handleDelete(deletingId)}
          />,
          document.body,
        )}
    </div>
  );
}
