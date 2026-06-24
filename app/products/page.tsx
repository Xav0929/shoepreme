import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getAllProducts } from "@/lib/shopify";

export const metadata = {
  title: "All Products — Shoepreme PH",
};

export default async function ProductsPage() {
  const products = await getAllProducts(50);

  return (
    <main style={{ background: "#06090e", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "96px" }}>
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "clamp(40px, 6vw, 72px) 24px",
          }}
        >
          <div style={{ marginBottom: "40px" }}>
            <p
              style={{
                color: "#4a7fa5",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              All Products
            </p>
            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                color: "#f5f7f9",
                lineHeight: 1,
              }}
            >
              Shop Everything
            </h1>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "#8896a7",
              }}
            >
              <p>No products found. Check your Shopify connection.</p>
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
