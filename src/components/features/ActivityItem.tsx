'use client';

import React from 'react';
import { Activity } from '@/types/trip';
import { CATEGORY_ICONS } from '@/utils/constants';
import styles from './ActivityItem.module.css';

interface ActivityItemProps {
  activity: Activity;
}

/**
 * Renders an individual activity card with premium styling and accessibility.
 * WCAG 2.1 AA Compliant touch targets and contrast.
 * @param {ActivityItemProps} props - Component properties
 * @returns {React.JSX.Element} - Rendered activity
 */
export const ActivityItem = React.memo(({ activity }: ActivityItemProps): React.JSX.Element => {
  const categoryColor = getCategoryColor(activity.category);

  return (
    <article 
      className={styles.card} 
      style={{ '--category-color': categoryColor } as React.CSSProperties}
      aria-labelledby={`activity-${activity.id}-title`}
    >
      <div 
        className={styles.iconWrapper} 
        aria-hidden="true" 
        style={{ background: `${categoryColor}20` }}
      >
        {CATEGORY_ICONS[activity.category as keyof typeof CATEGORY_ICONS] ?? '📍'}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 id={`activity-${activity.id}-title`} className={styles.title}>
            {activity.name}
          </h4>
          <span 
            className={styles.time} 
            style={{ background: `${categoryColor}20`, color: categoryColor }}
          >
            {activity.time} ({activity.duration_mins}m)
          </span>
        </div>

        <p className={styles.location} aria-label="Location">
          {activity.location}
        </p>
        
        <div className={styles.details}>
          {activity.dietary_options && activity.dietary_options.length > 0 && (
            <div className={styles.tagGroup} role="list" aria-label="Dietary options">
              {activity.dietary_options.map(opt => (
                <span key={opt} className={styles.tag} role="listitem">{opt}</span>
              ))}
            </div>
          )}
          
          <p className={styles.tip}>
            <strong>Insider Tip:</strong> {activity.tips}
          </p>

          {activity.off_peak_tip && (
            <p className={styles.offPeak}>
              <strong>Crowd Tip:</strong> {activity.off_peak_tip}
            </p>
          )}

          {activity.accessibility_notes && (
            <p className={styles.accessibility}>
              ♿ {activity.accessibility_notes}
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.costInfo}>
            <span className={styles.costUsd}>${activity.cost_usd}</span>
            <span className={styles.costLocal}>({activity.cost_local})</span>
          </div>
          
          <div className={styles.actions}>
            {activity.booking_required && activity.booking_url && (
              <a 
                href={activity.booking_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.bookingBtn}
                aria-label={`Book ${activity.name}`}
              >
                Book Now
              </a>
            )}
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.google_maps_query)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.mapsBtn}
              aria-label="View on Google Maps"
            >
              Maps
            </a>
          </div>
        </div>
      </div>
    </article>
  );
});

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'attraction': return '#6366f1';
    case 'food': return '#f43f5e';
    case 'accommodation': return '#10b981';
    case 'transport': return '#f59e0b';
    case 'leisure': return '#8b5cf6';
    default: return '#64748b';
  }
};

ActivityItem.displayName = 'ActivityItem';
