import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, formatPrice } from "../data/products";
import { useAddToCart } from "../hooks/useAddToCart";
import { QuantityPicker } from "../components/QuantityPicker";
import styles from "./ProductDetail.module.scss";

// Mock variant data — Fake Store API has no real variants, but the spec
// asks for colour/size selectors with stock states reflected in the URL.
const COLOURS = ["Stone", "Charcoal", "Sand", "Ink"];
const SIZES = ["XS", "S", "M", "L", "XL"];

function getVariantStock(productId: number, colour: string, size: string): number {
  const seed = productId + colour.length * 7 + size.length * 13;
  const bucket = seed % 8;
  if (bucket === 0) return 0; // sold out
  if (bucket <= 2) return 1 + (seed % 3); // low
  return 10 + (seed % 15);
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const colour = searchParams.get("colour") ?? COLOURS[0];
  const size = searchParams.get("size") ?? SIZES[1];

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: Number.isFinite(productId),
  });

  const { add, loading: adding, error: addError } = useAddToCart();

  const variantStock = useMemo(
    () => (product ? getVariantStock(product.id, colour, size) : 0),
    [product, colour, size],
  );
  const isSoldOut = variantStock === 0;
  const isLowStock = variantStock > 0 && variantStock <= 3;

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
  }, [productId]);

  const setVariant = (next: Partial<{ colour: string; size: string }>) => {
    const params = new URLSearchParams(searchParams);
    if (next.colour) params.set("colour", next.colour);
    if (next.size) params.set("size", next.size);
    setSearchParams(params, { replace: true });
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonText}>
            <div className={styles.skLine} style={{ width: "40%" }} />
            <div className={styles.skLine} style={{ width: "80%" }} />
            <div className={styles.skLine} style={{ width: "30%" }} />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBox}>
          <p>We couldn't load this product.</p>
          <button className="btn btn--secondary" onClick={() => refetch()}>
            Try again
          </button>
          <Link to="/" className="btn btn--ghost">
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const displayPrice = product.salePrice ?? product.price;

  return (
    <main className={styles.page}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link to="/">Shop</Link>
        <span aria-hidden="true">/</span>
        <span className={styles.crumbCurrent}>{product.brand}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={product.images[activeImage] ?? product.image}
              alt={product.title}
            />
          </div>
          <div className={styles.thumbs} role="tablist" aria-label="Product images">
            {product.images.map((src, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === activeImage}
                className={`${styles.thumb} ${idx === activeImage ? styles.thumbActive : ""}`}
                onClick={() => setActiveImage(idx)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.brand}>{product.brand}</p>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.priceRow}>
            {product.salePrice ? (
              <>
                <span className={styles.salePrice}>{formatPrice(product.salePrice)}</span>
                <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                <span className={styles.savePill}>
                  Save {formatPrice(product.price - product.salePrice)}
                </span>
              </>
            ) : (
              <span className={styles.price}>{formatPrice(displayPrice)}</span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.variantGroup}>
            <div className={styles.variantHead}>
              <span className={styles.variantLabel}>Colour</span>
              <span className={styles.variantValue}>{colour}</span>
            </div>
            <div className={styles.swatches} role="radiogroup" aria-label="Colour">
              {COLOURS.map((c) => (
                <button
                  key={c}
                  role="radio"
                  aria-checked={c === colour}
                  className={`${styles.swatch} ${c === colour ? styles.swatchActive : ""}`}
                  onClick={() => setVariant({ colour: c })}
                  title={c}
                >
                  <span
                    className={styles.swatchDot}
                    style={{ background: colourHex(c) }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.variantGroup}>
            <div className={styles.variantHead}>
              <span className={styles.variantLabel}>Size</span>
              <a href="#" className={styles.sizeGuide} onClick={(e) => e.preventDefault()}>
                Size guide
              </a>
            </div>
            <div className={styles.sizes} role="radiogroup" aria-label="Size">
              {SIZES.map((s) => {
                const stock = getVariantStock(product.id, colour, s);
                const sold = stock === 0;
                const low = stock > 0 && stock <= 3;
                return (
                  <button
                    key={s}
                    role="radio"
                    aria-checked={s === size}
                    disabled={sold}
                    className={`${styles.sizeBtn} ${s === size ? styles.sizeActive : ""} ${
                      sold ? styles.sizeSold : ""
                    } ${low ? styles.sizeLow : ""}`}
                    onClick={() => setVariant({ size: s })}
                    data-testid={`size-${s}`}
                  >
                    <span>{s}</span>
                    {sold && <span className={styles.sizeNote}>Sold out</span>}
                    {!sold && low && <span className={styles.sizeNote}>Low</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {isLowStock && !isSoldOut && (
            <p className={styles.stockNote}>
              Only {variantStock} left in {colour} / {size}.
            </p>
          )}

          <div className={styles.cta}>
            <QuantityPicker
              value={qty}
              onChange={setQty}
              max={Math.max(1, Math.min(10, variantStock || 1))}
            />
            <button
              type="button"
              className="btn btn--primary btn--block"
              disabled={isSoldOut || adding}
              onClick={() => add(product, qty)}
              data-testid="add-to-cart"
            >
              {isSoldOut ? "Sold out" : adding ? "Adding…" : "Add to cart"}
            </button>
          </div>

          {addError && <p className={styles.error}>{addError}</p>}

          <ul className={styles.meta}>
            <li>Free shipping over $75</li>
            <li>Returns within 30 days</li>
            <li>Category: {product.category}</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function colourHex(name: string): string {
  switch (name) {
    case "Stone":
      return "#cfc8bd";
    case "Charcoal":
      return "#3a3a3a";
    case "Sand":
      return "#d8c6a3";
    case "Ink":
      return "#1a2238";
    default:
      return "#cccccc";
  }
}
