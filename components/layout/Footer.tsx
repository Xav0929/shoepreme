import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0d1117",
        color: "#f5f7f9",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 72px) 32px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "40px",
          position: "relative",
        }}
      >
        {/* Brand */}
        <div style={{ gridColumn: "span 1" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <Image
              src="/logo.png"
              alt="Shoepreme"
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "1.6rem",
                letterSpacing: "0.1em",
                color: "#f5f7f9",
              }}
            >
              SHOEPREME
            </span>
          </div>
          <p
            style={{
              color: "rgba(245,247,249,0.4)",
              fontSize: "12px",
              lineHeight: 1.7,
              maxWidth: "200px",
              marginBottom: "20px",
            }}
          >
            Authentic performance shoes from the world&apos;s best brands.
            Koronadal City, South Cotabato.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "FB", href: "https://facebook.com" },
              { label: "IG", href: "https://instagram.com" },
              { label: "TK", href: "https://tiktok.com" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(245,247,249,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 800,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(245,247,249,0.3)",
              marginBottom: "16px",
            }}
          >
            Shop
          </h4>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {["Men", "Women", "Running", "Basketball", "Pre-order", "Sale"].map(
              (label) => (
                <li key={label}>
                  <Link
                    href={`/collections/${label.toLowerCase()}`}
                    style={{
                      color: "rgba(245,247,249,0.55)",
                      fontSize: "13px",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(245,247,249,0.3)",
              marginBottom: "16px",
            }}
          >
            Info
          </h4>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {[
              "About Us",
              "Size Guide",
              "Shipping Policy",
              "Return Policy",
              "Contact",
            ].map((label) => (
              <li key={label}>
                <Link
                  href="#"
                  style={{
                    color: "rgba(245,247,249,0.55)",
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(245,247,249,0.3)",
              marginBottom: "16px",
            }}
          >
            Contact
          </h4>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <li
              style={{
                color: "rgba(245,247,249,0.55)",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "rgba(245,247,249,0.25)",
                }}
              >
                LOC
              </span>
              Koronadal City, South Cotabato
            </li>
            <li
              style={{
                color: "rgba(245,247,249,0.55)",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "rgba(245,247,249,0.25)",
                }}
              >
                SRC
              </span>
              JP · TW · HK · US
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "20px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
          className="footer-bottom"
        >
          <p style={{ color: "rgba(245,247,249,0.25)", fontSize: "12px" }}>
            © 2026 Shoepreme Koronadal. All rights reserved.
          </p>
          {/* <p style={{ color: "rgba(245,247,249,0.18)", fontSize: "12px" }}>
            Built by{" "}
            <a
              href="https://yur1.xyz"
              style={{ color: "rgba(74,127,165,0.7)", textDecoration: "none" }}
            >
              yur1.xyz
            </a>
          </p> */}
        </div>
      </div>

      <style>{`
        .footer-social:hover {
          border-color: rgba(255,255,255,0.3) !important;
          color: rgba(245,247,249,0.9) !important;
          background: rgba(255,255,255,0.06);
        }
        @media (min-width: 640px) {
          .footer-bottom { flex-direction: row !important; }
        }
      `}</style>
    </footer>
  );
}
