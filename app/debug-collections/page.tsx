import { getAllCollections } from "@/lib/shopify";

export default async function DebugPage() {
  const collections = await getAllCollections();
  return (
    <pre
      style={{
        background: "#111",
        color: "#0f0",
        padding: "40px",
        minHeight: "100vh",
      }}
    >
      {JSON.stringify(collections, null, 2)}
    </pre>
  );
}
