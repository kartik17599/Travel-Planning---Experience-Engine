import React from 'react';
import { clsx } from 'clsx';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: string;
}

/**
 * High-End Minimalist Input Component.
 * Inspired by Emergent.sh - Features a refined floating placeholder effect 
 * and ultra-clean aesthetic.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, icon, ...props }, ref): React.JSX.Element => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${inputId}-error`;

    return (
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              styles.input,
              error && styles.inputError,
              icon && styles.hasIcon,
              className
            )}
            placeholder=" " // Required for the CSS floating label effect
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
          <div className={styles.focusLine} />
        </div>
        {error && (
          <p id={errorId} className={styles.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
