import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import styles from "./ProductList.module.scss";

export function ProductListPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>New Arrivals</p>
        <h1 className={styles.heading}>
          Considered objects for everyday wear.
        </h1>
        <p className={styles.lede}>
          A small, edited collection — pieces we'd buy ourselves and live in for years.
        </p>
      </section>

      {isError && (
        <div className={styles.errorBox}>
          <p>We couldn't load the catalogue.</p>
          <button className="btn btn--secondary" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div className={styles.grid} aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {data && (
        <div className={styles.grid}>
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
