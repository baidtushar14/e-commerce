import { useCallback, useState } from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

// Mock async "Add to cart" with a simulated random failure.
// Roughly 1 in 6 calls fail to exercise the error UI.
function mockApiAddToCart(): Promise<void> {
  return new Promise((resolve, reject) => {
    const delay = 350 + Math.random() * 450;
    setTimeout(() => {
      if (Math.random() < 1 / 6) {
        reject(new Error("Something went wrong adding this item. Please try again."));
      } else {
        resolve();
      }
    }, delay);
  });
}

interface UseAddToCartResult {
  add: (product: Product, quantity?: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export function useAddToCart(): UseAddToCartResult {
  const { addItem, openDrawer } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const add = useCallback(
    async (product: Product, quantity = 1): Promise<boolean> => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        await mockApiAddToCart();
        addItem(product, quantity);
        setSuccess(true);
        openDrawer();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        return false;
      } finally {
        setLoading(false);
        setTimeout(() => setSuccess(false), 1500);
      }
    },
    [addItem, openDrawer],
  );

  return {
    add,
    loading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
}
