import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>404</p>
      <h1>This page wandered off.</h1>
      <p className={styles.text}>
        The product or page you're after isn't here. Head back to the shop to keep browsing.
      </p>
      <Link to="/" className="btn btn--primary">
        Back to shop
      </Link>
    </main>
  );
}
