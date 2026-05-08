'use client';

import React from 'react';
import { Activity } from '@/types/trip';
import { CATEGORY_ICONS } from '@/utils/constants';
import styles from './ActivityItem.module.css';

interface ActivityItemProps {
  /** The specific travel activity data to display */
  activity: Activity;
}

/**
 * TravelAI v5.0 Activity Card.
 * Implementation: Minimalist luxury card with refined typography and subtle accents.
 * Optimized with React.memo for high-performance timeline rendering.
 * @param {ActivityItemProps} props - Component properties
 * @returns {React.JSX.Element} - The rendered activity card
 */
export const ActivityItem = React.memo(({ activity }: ActivityItemProps): React.JSX.Element => {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{CATEGORY_ICONS[activity.category as keyof typeof CATEGORY_ICONS] ?? '📍'}</span>
        </div>
        <div className={styles.titleArea}>
          <div className={styles.meta}>
            <span className={styles.time}>{activity.time}</span>
            <span className={styles.dot}>·</span>
            <span className={styles.duration}>{activity.duration_mins}m</span>
          </div>
          <h5 className={styles.title}>{activity.name}</h5>
        </div>
      </div>
      
      <p className={styles.description}>{activity.tips}</p>
      
      <div className={styles.footer}>
        <div className={styles.priceArea}>
          <span className={styles.priceLabel}>Est. Cost</span>
          <span className={styles.price}>{activity.cost_local}</span>
        </div>
        <div className={styles.actions}>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.google_maps_query)}`}
            target="_blank" rel="noopener noreferrer"
            className={styles.mapLink}
          >
            Details ↗
          </a>
        </div>
      </div>
    </article>
  );
});

ActivityItem.displayName = 'ActivityItem';
