import { NextResponse } from "next/server";

const SHOPIFY_ADMIN_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

async function adminFetch(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(SHOPIFY_ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  return res.json();
}

export async function GET() {
  const data = await adminFetch(`
    query getDraftOrders {
      draftOrders(first: 50, query: "tag:reserve", sortKey: NUMBER, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            status
            invoiceUrl
            totalPrice
            email
            customer { displayName email }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variantTitle
                  originalUnitPrice
                  variant {
                    image { url }
                    product { featuredImage { url } }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  if (data.errors) {
    console.error(
      "Shopify draftOrders admin query error:",
      JSON.stringify(data.errors, null, 2),
    );
    return NextResponse.json([]);
  }

  const edges = data?.data?.draftOrders?.edges ?? [];
  const draftOrders = edges.map(({ node }: any) => ({
    id: node.id,
    name: node.name,
    createdAt: node.createdAt,
    status: node.status,
    invoiceUrl: node.invoiceUrl,
    totalPrice: node.totalPrice,
    email: node.customer?.email ?? node.email,
    customerName: node.customer?.displayName ?? "Guest",
    lineItems: node.lineItems.edges.map(({ node: item }: any) => ({
      title: item.title,
      quantity: item.quantity,
      variantTitle: item.variantTitle,
      originalUnitPrice: item.originalUnitPrice,
      image:
        item.variant?.image?.url ??
        item.variant?.product?.featuredImage?.url ??
        null,
    })),
  }));

  return NextResponse.json(draftOrders);
}
