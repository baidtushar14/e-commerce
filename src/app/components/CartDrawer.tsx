import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { QuantityPicker } from "./QuantityPicker";
import styles from "./CartDrawer.module.scss";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, items, subtotal, setQuantity, removeItem } =
    useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <>
      <div
        className={`${styles.overlay} ${drawerOpen ? styles.overlayOpen : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Your Cart</h2>
          <button
            type="button"
            className={styles.close}
            onClick={closeDrawer}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Your cart is empty.</p>
            <p className={styles.emptyText}>
              Add a few favourites and they'll show up here.
            </p>
            <button className="btn btn--secondary" onClick={closeDrawer}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.productId} className={styles.item}>
                  <Link
                    to={`/product/${item.productId}`}
                    className={styles.thumb}
                    onClick={closeDrawer}
                  >
                    <img src={item.image} alt="" loading="lazy" />
                  </Link>
                  <div className={styles.itemBody}>
                    <div className={styles.itemTop}>
                      <Link
                        to={`/product/${item.productId}`}
                        className={styles.itemTitle}
                        onClick={closeDrawer}
                      >
                        {item.title}
                      </Link>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.title}`}
                      >
                        Remove
                      </button>
                    </div>
                    <p className={styles.itemPrice}>{formatPrice(item.unitPrice)}</p>
                    <div className={styles.itemFooter}>
                      <QuantityPicker
                        value={item.quantity}
                        onChange={(q) => setQuantity(item.productId, q)}
                      />
                      <span className={styles.lineTotal}>
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className={styles.footer}>
              <dl className={styles.summary}>
                <div className={styles.summaryRow}>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <dt>Total</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
              </dl>
              <p className={styles.taxNote}>Taxes & shipping calculated at checkout.</p>
              <button className="btn btn--primary btn--block">Checkout</button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
