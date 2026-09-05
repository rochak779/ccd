import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import styles from "./controls.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  busy?: boolean;
};

export function Button({ variant = "primary", busy, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`${styles.button} ${styles[variant]} ${props.className ?? ""}`}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
    >
      {busy ? <span className={styles.spinner} aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

type FieldProps = {
  label: string;
  hint?: ReactNode;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, hint, error, id, className, ...props }: FieldProps) {
  const fieldId = id ?? props.name;
  const detailId = `${fieldId}-detail`;
  return (
    <label className={`${styles.field} ${className ?? ""}`} htmlFor={fieldId}>
      <span className={styles.label}>{label}</span>
      <input {...props} id={fieldId} aria-invalid={Boolean(error)} aria-describedby={(hint || error) ? detailId : undefined} />
      {(hint || error) ? <span className={error ? styles.error : styles.hint} id={detailId}>{error ?? hint}</span> : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ label, hint, id, children, className, ...props }: SelectFieldProps) {
  const fieldId = id ?? props.name;
  return (
    <label className={`${styles.field} ${className ?? ""}`} htmlFor={fieldId}>
      <span className={styles.label}>{label}</span>
      <select {...props} id={fieldId} aria-describedby={hint ? `${fieldId}-detail` : undefined}>{children}</select>
      {hint ? <span className={styles.hint} id={`${fieldId}-detail`}>{hint}</span> : null}
    </label>
  );
}

