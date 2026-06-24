import { Link } from "react-router-dom";
import { useState } from "react";
import type { Product } from "../types";
import { formatPrice } from "../data/products";
import { useAddToCart } from "../hooks/useAddToCart";
import styles from "./ProductCard.module.scss";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { add, loading, error } = useAddToCart();
  const [justAdded, setJustAdded] = useState(false);
  const isSoldOut = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const price = product.salePrice ?? product.price;

  const onQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    const ok = await add(product, 1);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageBox}>
          <img src={product.image} alt={product.title} loading="lazy" />
          {product.salePrice && <span className={styles.tag}>Sale</span>}
          {isSoldOut && <span className={`${styles.tag} ${styles.tagSoldOut}`}>Sold out</span>}
          {!isSoldOut && isLowStock && (
            <span className={`${styles.tag} ${styles.tagLow}`}>Low stock</span>
          )}
          {!isSoldOut && (
            <button
              type="button"
              className={styles.quickAdd}
              onClick={onQuickAdd}
              disabled={loading}
              aria-label={`Quick add ${product.title} to cart`}
            >
              {loading ? "Adding…" : justAdded ? "Added ✓" : "Quick add"}
            </button>
          )}
        </div>
      </Link>
      <div className={styles.body}>
        <p className={styles.brand}>{product.brand}</p>
        <Link to={`/product/${product.id}`} className={styles.title}>
          {product.title}
        </Link>
        <p className={styles.price}>
          {product.salePrice ? (
            <>
              <span className={styles.salePrice}>{formatPrice(product.salePrice)}</span>
              <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
            </>
          ) : (
            <span>{formatPrice(price)}</span>
          )}
        </p>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </article>
  );
}
