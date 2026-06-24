import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getCollectionProducts } from "@/lib/shopify";

// URL slug (clean, what users see) → actual Shopify collection handle (messy, legacy)
const SLUG_TO_HANDLE: Record<string, string> = {
  basketball: "tennis",
  running: "shop-tennis-women",
  trail: "shop-trail-men",
  sneakers: "shop-sneakers",
  "in-store": "available-on-hand-in-store",
  sale: "shop-sale",
  new: "new-in-stock",
  men: "men",
  women: "women",
};

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const label =
    handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, " ");
  return { title: `${label} — Shoepreme PH` };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const shopifyHandle = SLUG_TO_HANDLE[handle] ?? handle;
  const { title, description, products } =
    await getCollectionProducts(shopifyHandle);

  return (
    <main style={{ background: "#0d1117", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "96px" }}>
        {/* Collection header */}
        <div
          style={{
            background: "#0d1117",
            padding: "clamp(40px, 7vw, 72px) 0",
            marginBottom: "0",
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
              padding: "0 32px",
              position: "relative",
            }}
          >
            <p
              style={{
                color: "#4a7fa5",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Collection
            </p>
            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                color: "#f5f7f9",
                lineHeight: 1,
                letterSpacing: "-0.01em",
                marginBottom: description ? "16px" : 0,
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  color: "rgba(245,247,249,0.45)",
                  fontSize: "15px",
                  maxWidth: "540px",
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Products */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "clamp(40px, 5vw, 64px) 32px",
            background: "#0d1117",
          }}
        >
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p
                style={{
                  color: "#8896a7",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                No products in this collection yet.
              </p>
              <a
                href="/products"
                style={{
                  background: "#0d1117",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Shop All Products
              </a>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
