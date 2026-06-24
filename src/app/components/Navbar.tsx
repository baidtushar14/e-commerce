import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.scss";

export function Navbar() {
  const { itemCount, toggleDrawer } = useCart();
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Nua — home">
          Nua
        </Link>
        <nav className={styles.links} aria-label="Primary">
          <Link to="/" className={styles.link}>
            Shop
          </Link>
          <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
            Journal
          </a>
          <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
            About
          </a>
        </nav>
        <button
          type="button"
          className={styles.cartBtn}
          onClick={toggleDrawer}
          aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {itemCount > 0 && (
            <span className={styles.badge} aria-hidden="true">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
