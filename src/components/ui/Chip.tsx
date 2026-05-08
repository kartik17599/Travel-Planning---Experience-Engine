import React from 'react';
import { clsx } from 'clsx';
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
}

/**
 * Accessible Chip component for selecting interests.
 * @param {ChipProps} props - Component properties
 * @returns {React.JSX.Element} - Rendered chip
 */
export const Chip = ({ label, selected = false, onClick }: ChipProps): React.JSX.Element => {
  return (
    <button
      type="button"
      className={clsx(styles.chip, selected && styles.selected)}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
