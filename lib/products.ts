import { shopifyClient } from "./shopify";

export async function getAllProducts() {
  const query = `
    query {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;
  const { data } = await shopifyClient.request(query);
  return data?.products?.edges?.map((edge: any) => edge.node) ?? [];
}
