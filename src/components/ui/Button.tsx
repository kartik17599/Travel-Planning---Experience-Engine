import React from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Accessible Button component with support for variants and icons.
 * @param {ButtonProps} props - Component properties
 * @returns {JSX.Element} - Rendered button
 */
export const Button = ({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span role="status" aria-label="Loading">...</span>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

Button.displayName = 'Button';
