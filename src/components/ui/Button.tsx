import React from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Accessible Button component with support for variants and icons.
 * @param {ButtonProps} props - Component properties
 * @returns {React.JSX.Element} - Rendered button
 */
export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner} role="status" aria-label="Loading" />
      ) : (
        <>
          {leftIcon && <span className={styles.icon} aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span className={styles.icon} aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

Button.displayName = 'Button';
