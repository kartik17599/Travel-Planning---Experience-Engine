'use client';

import React from 'react';
import { Activity } from '@/types/trip';
import { CATEGORY_ICONS } from '@/utils/constants';
import styles from './ActivityItem.module.css';

interface ActivityItemProps {
  activity: Activity;
}

/**
 * Renders an individual activity card with premium styling.
 * @param {ActivityItemProps} props - Component properties
 * @returns {JSX.Element} - Rendered activity
 */
export const ActivityItem = React.memo(({ activity }: ActivityItemProps): JSX.Element => {
  const categoryColor = getCategoryColor(activity.category);

  return (
    <div 
      className={styles.card} 
      style={{ '--category-color': categoryColor } as React.CSSProperties}
    >
      <div className={styles.iconWrapper} aria-hidden="true" style={{ background: `${categoryColor}20` }}>
        {CATEGORY_ICONS[activity.category]}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{activity.name}</h4>
          <span className={styles.time} style={{ background: `${categoryColor}20`, color: categoryColor }}>
            {activity.startTime} - {activity.endTime}
          </span>
        </div>
        <p className={styles.description}>
          {activity.description}
        </p>
        <div className={styles.footer}>
          <span className={styles.location}>
            📍 {activity.location.name}
          </span>
          <span className={styles.cost}>
            ${activity.estimatedCost}
          </span>
        </div>
      </div>
    </div>
  );
});

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'attraction': return '#6366f1';
    case 'food': return '#f43f5e';
    case 'hotel': return '#10b981';
    case 'transit': return '#f59e0b';
    default: return '#64748b';
  }
};

ActivityItem.displayName = 'ActivityItem';
