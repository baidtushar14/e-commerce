import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "../context/CartContext";
import { ProductDetailPage } from "../pages/ProductDetail";
import type { Product } from "../types";

const baseProduct: Product = {
  id: 7,
  title: "Test Tee",
  price: 40,
  description: "A nice tee",
  category: "men's clothing",
  image: "https://example.com/a.jpg",
  rating: { rate: 4.2, count: 100 },
  brand: "Atelier",
  stock: 5,
  images: ["a", "b", "c", "d"],
};

vi.mock("../data/products", async () => {
  const actual = await vi.importActual<typeof import("../data/products")>(
    "../data/products",
  );
  return {
    ...actual,
    fetchProduct: vi.fn(async () => baseProduct),
  };
});

function renderAt(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <CartProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    </QueryClientProvider>,
  );
}

describe("Variant selector (ProductDetail)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("disables Add to cart when the chosen variant is sold out", async () => {
    // For productId=7, the colour/size pair that hashes to bucket 0 is sold out.
    // We sweep the size list and pick the first sold-out one based on the same
    // deterministic seed used by the page.
    const sizes = ["XS", "S", "M", "L", "XL"];
    const colours = ["Stone", "Charcoal", "Sand", "Ink"];
    const getStock = (id: number, c: string, s: string) => {
      const seed = id + c.length * 7 + s.length * 13;
      const b = seed % 8;
      if (b === 0) return 0;
      if (b <= 2) return 1 + (seed % 3);
      return 10;
    };
    let pickC = "";
    let pickS = "";
    outer: for (const c of colours) {
      for (const s of sizes) {
        if (getStock(7, c, s) === 0) {
          pickC = c;
          pickS = s;
          break outer;
        }
      }
    }
    expect(pickS).not.toBe("");

    renderAt(`/product/7?colour=${pickC}&size=${pickS}`);
    const cta = await screen.findByTestId("add-to-cart");
    expect(cta).toBeDisabled();
    expect(cta).toHaveTextContent(/sold out/i);
  });

  it("caps the quantity picker based on remaining stock", async () => {
    renderAt(`/product/7?colour=Stone&size=M`);
    await screen.findByTestId("add-to-cart");
    const inc = screen.getByLabelText("Increase quantity");
    // Click many times — should cap (max is min(10, variantStock))
    for (let i = 0; i < 20; i++) fireEvent.click(inc);
    const value = Number(screen.getByTestId("qty-value").textContent);
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(10);
    await waitFor(() => expect(inc).toBeDisabled());
  });
});
