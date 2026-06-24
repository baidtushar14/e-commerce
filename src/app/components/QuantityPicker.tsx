import styles from "./QuantityPicker.module.scss";

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  ariaLabel?: string;
}

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  ariaLabel = "Quantity",
}: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className={styles.wrap} role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className={styles.btn}
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.value} aria-live="polite" data-testid="qty-value">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
