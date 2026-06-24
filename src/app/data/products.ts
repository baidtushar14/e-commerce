import type { ApiProduct, Product } from "../types";

const API_BASE = "https://fakestoreapi.com";

// Deterministic enrichment so each product feels real even though
// the Fake Store API has no variants/brand/stock data.
function enrich(p: ApiProduct): Product {
  const seed = p.id;
  // Pseudo-random but stable per product
  const stockBucket = seed % 7;
  let stock: number;
  if (stockBucket === 0) stock = 0;
  else if (stockBucket <= 2) stock = 1 + (seed % 3); // 1-3 (low)
  else stock = 12 + (seed % 20);

  const hasSale = seed % 4 === 0;
  const salePrice = hasSale
    ? Math.round(p.price * 0.8 * 100) / 100
    : undefined;

  const brandPool = [
    "Atelier",
    "Northbound",
    "Maison",
    "Wovenly",
    "Halcyon",
    "Field & Stone",
  ];
  const brand = brandPool[seed % brandPool.length];

  return {
    ...p,
    brand,
    salePrice,
    stock,
    images: [p.image, p.image, p.image, p.image],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to load products");
  const data = (await res.json()) as ApiProduct[];
  return data.map(enrich);
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product");
  const data = (await res.json()) as ApiProduct;
  return enrich(data);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
